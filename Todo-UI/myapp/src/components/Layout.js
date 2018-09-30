import { Layout, Menu, Button, Form, Modal, Input } from 'antd'
import React from 'react'
import Axios from 'axios';
import TodoList from './TodoList'
import './css/Layout.css'
import {connect} from 'react-redux'
import { initializeState } from '../actions/LayoutActions'
import { updateState } from '../actions/SharedActions'
const { Header, Content, Footer, Sider } = Layout

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new list"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);


class AntLayout extends React.Component {

  state = {
    visible: false,
    ref: this
  };

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let that = this.state.ref
      Axios.post('http://localhost:8080/newList', {name: values.title} )
      .then(function (response) {
        return that.props.updateState(response.data)
      })

      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  componentDidMount() {
    Axios.get('http://localhost:8080/').then((response) => {
      return this.props.populateInitialState(response.data)
    })
  }

  render () {
    return (<Layout>
      <Header className='header'>
        <div className='logo' />
        
        <Menu
          theme='dark'
          mode='horizontal'
          style={{ lineHeight: '48px' }}
        >
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode='inline'
              defaultSelectedKeys={['1']}
              style={{ height: '100%' }}
            >
              <Button size='large' className='btnAddNewList' icon='schedule' onClick={this.showModal}>Add new list</Button>
              <CollectionCreateForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
              />
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <TodoList />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    populateInitialState: (res) => { dispatch( initializeState(res) ) },
    updateState: (newState) => { dispatch( updateState(newState) ) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AntLayout)
