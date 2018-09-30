import React, { Component } from 'react'
import { List, Card, Button, Popconfirm, message, Icon, Form, Modal, Input, DatePicker, Dropdown, Menu, Divider, Table } from 'antd'
import Axios from 'axios';
import './css/TodoList.css'
import TodoItem from './TodoItem'
import {connect} from 'react-redux'
import moment from 'moment'
import { addItemToList } from '../actions/ListActions'
import { updateState } from '../actions/SharedActions'
require('moment/locale/en-gb')

const FormItem = Form.Item;

function disabledDate(current) {
  return current && current < moment().endOf('day');
}

const { TextArea } = Input;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new note"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of note!' }],
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="Description">
              {getFieldDecorator('description', {
                  rules: [{ required: true, message: 'Please input the description of note!' }],
                })(
                  <TextArea rows={3} />
              )}
            </FormItem>

            <FormItem label="Complete before">
              {getFieldDecorator('date', {
                  rules: [{ required: true, message: 'Please input the expiration date!' }],
                })(
                  <DatePicker
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                  />
              )}
            </FormItem>
            
          </Form>
        </Modal>
      );
    }
  }
);


const ListFilterOrder = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onDone, items, that } = this.props;
      const columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()) },
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="Search name"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={that.handleSearch(selectedKeys, confirm)}
            />
            <Button type="primary" onClick={that.handleSearch(selectedKeys, confirm)}>Search</Button>
            <Button onClick={that.handleReset(clearFilters)}>Reset</Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },
        render: (text) => {
          const { searchText } = that.state;
          return searchText ? (
            <span>
              {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                fragment.toLowerCase() === searchText.toLowerCase()
                  ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
              ))}
            </span>
          ) : text;
        },
      }, {
        title: 'Status',
        dataIndex: 'statusText',
        key: 'statusText',
        filters: [{
          text: 'In progress',
          value: 'In progress',
        }, {
          text: 'Completed',
          value: 'Completed',
        }, {
          text: 'Expired',
          value: 'Expired'
        }],
        onFilter: (value, record) => record.statusText.indexOf(value) === 0,
        sorter: (a, b) => { return a.statusText.toLowerCase().localeCompare(b.statusText.toLowerCase()) }
      }, {
        title: 'Created on',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) =>  moment(a.createdAt, 'DD-MM-YYYY').valueOf() - moment(b.createdAt, 'DD-MM-YYYY').valueOf(),
      }, {
        title: 'Expires on',
        dataIndex: 'deadline',
        key: 'deadline',
        sorter: (a, b) => { return moment(a.deadline, 'DD-MM-YYYY').unix() - moment(b.deadline, 'DD-MM-YYYY').unix() },
      }, {
        title: 'Dependency',
        dataIndex: 'depName',
        key: 'depName',
        sorter: (a, b) => { return a.depName.toLowerCase().localeCompare(b.depName.toLowerCase()) }
      }];
      
      function onChange(pagination, filters, sorter) {
        //console.log('params', pagination, filters, sorter);
      }
      //console.log(items)
      function tuneItems () {
        let copy = [...items]
        copy.forEach((item, index) => {
          item.key = (index + 1)
          if (item.dependsOn.length > 0) {
            item.depName = items[item.dependsOn[0].itemDependency.index].name
          }
          if (item.status === true) {
            item.statusText = 'Completed'
          } else {
            let parsedExpirationDate = moment(item.deadline, 'DD-MM-YYYY').format('YYYY-MM-DD')
            let now = moment().format('YYYY-MM-DD')
            let result = moment(now).isSameOrAfter(parsedExpirationDate)
            if (result) {
              item.statusText = 'Expired'
            } else {
              item.statusText = 'In progress'
            }
          }
        })
        return copy
      }
      return (
        <Modal
          visible={visible}
          title="Filter and order"
          okText="Done"
          onCancel={onCancel}
          onOk={onDone}
          items={items}
          that={that}
          width='800px'
        >
        <Table columns={columns} dataSource={tuneItems(items)} onChange={onChange} />
        </Modal>
      );
    }
  }
);


class TodoList extends Component {

  state = {
    addVisible: false,
    tableVisible: false,
    listId: -1,
    searchText: '',
    ref: this
  }

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  showModal = () => {
    this.setState({ addVisible: true });
  }

  handleCancel = () => {
    this.setState({ addVisible: false, tableVisible: false });
  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let that = this.state.ref
      Axios.post('http://localhost:8080/addItem', { listIndex: this.state.listId , item: {
        name: values.title,
        description: values.description,
        deadline: values.date.format('L')
      }} )
      .then(function (response) {
        message.success('A new task has been created')
        return that.props.updateState(response.data)
      })

      form.resetFields();
      this.setState({ addVisible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  deleteCancel = (e) => {

  }

  deleteConfirm = (e) => {
    Axios.delete('http://localhost:8080/deleteList',
     { data: { index: this.state.listId } }
    ).then((response) => {
       if (response.status === 200) {
         message.success('The list has been deleted')
         return this.props.updateState(response.data)
       } else {
        message.error('Oops! Something went wrong while trying to delete the list :(');
       }
     })
  }

  handleDeleteList = (e) => {
    this.setState({
      listId: e.target.getAttribute('data-list')
    })
  }

  handleDropdownClick = (e) => {
    this.setState({
      listId: e.target.getAttribute('data-list')
    })
  }

  showTable = () => {
    this.setState({
      tableVisible : true
    })
  }

  handleMenuClick = (e) => {
    if (e.key === 'addItem') {
      this.showModal()
    }

    if (e.key === 'combined') {
      this.showTable()
    }

    //console.log(e)
  }


  render () {
    return (
      this.props.lists.length > 0 ? <div>
        <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.addVisible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
              />
        <List
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
      dataSource={this.props.lists}
      renderItem={(item, index) => (
    <List.Item>
      <Card title={item.name} extra={
        <span>
        <ListFilterOrder
                visible={this.state.tableVisible}
                onCancel={this.handleCancel}
                onDone={this.handleCancel}
                items={item.items}
                that={this}
              />

          <Dropdown trigger={['click']} overlay={
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key="addItem"><Icon type="plus" />New note</Menu.Item>
              <Menu.Item key="combined"><Icon type="sliders" />Filter / Sort</Menu.Item>
            </Menu>}>
            <Button data-list={index} onClick={this.handleDropdownClick} shape='circle' style={{ marginLeft: 8 }}>
              <Icon type="down" />
            </Button>
          </Dropdown>
          <Divider type='vertical' />
          <Popconfirm title="Are you sure delete this task?" onConfirm={this.deleteConfirm} onCancel={this.deleteCancel} okText="Yes" cancelText="No">
            <Button data-list={index} type="dashed" shape="circle" icon="delete" onClick={this.handleDeleteList} />
          </Popconfirm>
          
        </span>
        }>
        <TodoItem listIndex={index} itemsCollection={item.items} />
        </Card>
    </List.Item>
  )}
/>
      </div> : <p className='noListInformer'>You did'em all! It's time to relax <span><Icon type='smile' /></span></p>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lists: state.todos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTask: (listIndex, task) => { dispatch( addItemToList(listIndex, task) ) },
    updateState: (newState) => { dispatch( updateState(newState) ) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
