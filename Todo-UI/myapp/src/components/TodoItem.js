import React, { Component } from 'react'
import Axios from 'axios'
import { List, Button, Divider, Icon, Tooltip, Popconfirm, message, Tag, Popover, Select } from 'antd'
import { connect } from 'react-redux'
import { deleteItem } from '../actions/ItemActions'
import { updateState } from '../actions/SharedActions'
import moment from 'moment'
import './css/TodoItem.css'

const Option = Select.Option;

class TodoItem extends Component {

  state = {
    itemId: -1,
    listId: -1,
    selectables: new Map()
  }

  componentDidMount() {
    this.reOrderExpiredBadgeWithTitle()
  }

  reOrderExpiredBadgeWithTitle() {
    let parentsCollection = document.getElementsByClassName('ant-list-item-meta-avatar')
    for (let index = 0; index < parentsCollection.length; index++) {
      let content = parentsCollection[index].nextSibling
      if (content) {
        let parent = content.parentNode
        parent.insertBefore(content, parent.firstChild)
      }
    }
  }

  handleStepDone = (e) => {
    let status = e.target.getAttribute('data-status')
    if (status === 'false') {
      let now = moment().format('L') + ' ' + moment().format('LTS')
      Axios.post('http://localhost:8080/taskCompleted', { 'itemIndex': e.target.getAttribute('data-item'), 'listIndex': e.target.getAttribute('data-list'), 'completedAt': now })
      .then((response) => {
        if (response.status === 200) {
          message.success('The task has been completed')
          return this.props.updateState(response.data)
        }
      })
    } else {
      Axios.post('http://localhost:8080/taskNotCompleted', { 'itemIndex': e.target.getAttribute('data-item'), 'listIndex': e.target.getAttribute('data-list') })
      .then((response) => {
        if (response.status === 200) {
          message.success('The task has been activated back again')
          return this.props.updateState(response.data)
        }
      })
    }
  }

  deleteCancel = (e) => {

  }

  deleteConfirm = (e) => {
    Axios.post('http://localhost:8080/deleteItem', { 'itemIndex': this.state.itemId + '', 'listIndex': this.state.listId + ''})
    .then((response) => {
      if (response.status === 200) {
        message.success('Task has been deleted')
        return this.props.updateState(response.data)
      }
    })
  }

  handleStepRemove = (e) => {
    this.setState({
      itemId: e.target.getAttribute('data-item'),
      listId: e.target.getAttribute('data-list')
    })
  }

  hasTaskExpired = (time) => {
    let parsedExpirationDate = moment(time, 'DD-MM-YYYY').format('YYYY-MM-DD')
    let now = moment().format('YYYY-MM-DD')
    return moment(now).isSameOrAfter(parsedExpirationDate)
  }

  handleItemLinkButton = (e) => {
    this.setState({
      itemId: e.target.getAttribute('data-item')
    })
  }

  /**
   * 
   * handleLinkDeselect = (e) => {
    let dependency = e.split(' ')
    let reg = /^\d+$/
    //LOOK BACK THERE FOR E.G. Input: 1 2
    if(dependency[0].match(reg) && dependency[1].match(reg)) {
      Axios.post('http://localhost:8080/removeDependency', { "itemIndex": this.state.itemId, "listIndex": dependency[0], "itemDependency": dependency[1] })
      .then((response) => {
          message.info('A dependency has been removed from the task')
          return this.props.updateState(response.data)
      })
    } else {
      message.warning('Oops! Something went wrong')
    }
  }
   * 
   */

/**
 *   handleLinkSelect = (e) => {
    let dependency = e.split(' ')
    let coll = this.props.itemsCollection
    let currentItem = coll[this.state.itemId]
    let itemsDepends = currentItem.dependsOn
    let flag = true
    console.log(dependency[0], dependency[1])
    console.log(this.state.selectables)
    itemsDepends.forEach((item) => {
      if (item.listIndex.index == dependency[0] &&
      item.itemIndex.index == this.state.itemId &&
      item.itemDependency.index == dependency[1]) {
        message.warning('This item has already in dependencies')
        flag = false
    
      }
    })
    if(flag) {
      let dependencySelectables = this.state.selectables.get(dependency[0] + ' ' + dependency[1])
      dependencySelectables.forEach((item, index) => {
        if (item.key === dependency[0] + ' ' + this.state.itemId) {
          dependencySelectables.splice(index, 1)
          console.log(dependencySelectables)
        }
      })
      this.state.selectables.set(dependency[0] + ' ' + dependency[1], dependencySelectables)
      //console.log(dependencySelectables, this.state.selectables)
      Axios.post('http://localhost:8080/addDependency', { "itemIndex": this.state.itemId, "listIndex": dependency[0], "itemDependency": dependency[1] })
      .then((response) => {
          message.info('A dependency has been added to the task')
          return this.props.updateState(response.data)
      })
    }
  }
 */

  handleLinkChange = (e) => {
    let dependency = e.split(' ')
    let coll = this.props.itemsCollection
    let currentItem = coll[this.state.itemId]
    let itemsDepends = currentItem.dependsOn
    let flag = itemsDepends.length > 0 ? true : false
    Axios.post('http://localhost:8080/addDependency', { "itemIndex": this.state.itemId, "listIndex": dependency[0], "itemDependency": dependency[1] })
    .then((response) => {
        if (flag) {
          message.info('Dependency of task has been updated')
        } else {
          message.info('A dependency has been added to the task')
        }
        return this.props.updateState(response.data)
    })
  }

  handleRemoveDependency = (e) => {
    let itemId = e.target.getAttribute('data-item')
    let listId = e.target.getAttribute('data-list')
    let dependsOnList = this.props.itemsCollection[itemId].dependsOn[0]

    if(dependsOnList) {
      Axios.post('http://localhost:8080/removeDependency', { 'itemIndex': itemId + '', 'listIndex': listId + ''})
        .then((response) => {
          message.success('Dependency of the task has been removed')
          return this.props.updateState(response.data)
        })
    }else{
      message.error('This task does not have a dependency')
    }

  }

  removeItemsItselfReferenceFromSelectables = (arr, index) => {
    let copy = [...arr]
    copy.splice(index, 1)
    this.state.selectables.set(this.props.listIndex + ' ' + index, copy)
    return this.state.selectables.get(this.props.listIndex + ' ' + index)
  }

  disableCheckButtonIfDependsOnNotCompleted = (index) => {
    let dependsOnList = this.props.itemsCollection[index].dependsOn[0]
    if(dependsOnList && (dependsOnList.itemDependency.index)) {
      let dependentItem = this.props.itemsCollection[dependsOnList.itemDependency.index]
      if (dependentItem) {
        return !(dependentItem.status)
      }
    }
  }

  render () {
    
    const formatItemsForSelectableLinks = this.props.itemsCollection.map((item, index) => <Option key={this.props.listIndex + ' ' + index}>{item.name}</Option> )
    return (
      <List
        itemLayout='horizontal'
        dataSource={this.props.itemsCollection}
        renderItem={(item, index) => (
          <div>
          <List.Item actions={ this.hasTaskExpired(item.deadline) ? 
          [
            <Popconfirm title="Are you sure delete this note?" onConfirm={this.deleteConfirm} onCancel={this.deleteCancel} okText="Yes" cancelText="No">
              <Button 
              data-item={index} 
              data-list={this.props.listIndex}
              type='dashed' shape='circle' icon='delete' disabled={ item.status ? true : false } onClick={this.handleStepRemove} />
            </Popconfirm>
          ]
          :
          [
            <Button
              disabled={this.disableCheckButtonIfDependsOnNotCompleted(index)}
              data-list={this.props.listIndex} 
              data-item={index} shape='circle' 
              data-status={item.status}
              icon={item.status ? 'undo' : 'check'} onClick={this.handleStepDone} />,
              <Popover content={
                                <span style={{ width: '100%' }}>
                                  <Select
                                    style={{ width: '70%' }}
                                    placeholder="Select a task"
                                    
                                    defaultValue={item.dependsOn.map((data) => this.props.itemsCollection[data.itemDependency.index].name)}
                                    onChange={this.handleLinkChange}
                                  >
                                  {this.removeItemsItselfReferenceFromSelectables(
                                    formatItemsForSelectableLinks, index)}
                                  </Select>
                                  <Tooltip title='Remove dependency'>
                                    <Button
                                      
                                      style={{ float: 'right' }}
                                      shape='circle'
                                      data-list={this.props.listIndex} 
                                      data-item={index}
                                      icon='disconnect' onClick={this.handleRemoveDependency} />
                                    </Tooltip>
                                </span>
               } title="Dependency" trigger="click">
                <Button
                disabled={ item.status ? true : false }
                data-list={this.props.listIndex} 
                data-item={index} shape='circle' 
                data-status={item.status}
                icon='link' onClick={this.handleItemLinkButton} />
              </Popover>,
              <Popconfirm title="Are you sure delete this note?" onConfirm={this.deleteConfirm} onCancel={this.deleteCancel} okText="Yes" cancelText="No">
                <Button 
                data-item={index} 
                data-list={this.props.listIndex}
                type='dashed' shape='circle' icon='delete' disabled={ item.status ? true : false } onClick={this.handleStepRemove} />
              </Popconfirm>
            ]}
           extra={
      item.status ? <Tooltip placement="bottom" title='Completion date'>
                        <span><Icon type="check-circle" theme="filled" /> {item.completedAt}</span>
                    </Tooltip>
                   : 
                   <span>{!this.hasTaskExpired(item.deadline) && <span><Tooltip placement="bottom" title='Creation date'>
                            <span><Icon type="clock-circle" theme="filled" /> {item.createdAt}</span>
                         </Tooltip>
                         <Divider type="vertical" /></span>}
                         <Tooltip placement="bottom" title='Expiration date'>
                          <span><Icon type="close-circle" theme="filled" /> {item.deadline}</span>
                        </Tooltip>
                   </span>
                }
                >
            <List.Item.Meta className={item.status ? 'taskCompleted' : null}
              title={item.name}
              avatar={this.hasTaskExpired(item.deadline) ? <Tag color="#f50">Expired</Tag> : ''}
              description={item.description}
            />
          </List.Item>
          {(this.props.itemsCollection.length !== (index + 1)) ? <Divider type="horizontal" /> : ''}
          </div>
    )}
  />
    )
  }
}

const mapStateToProps = (state) => {
  let itemsOfList = []
  state.todos.forEach(val => {
    itemsOfList.push(val.items)
  })
  return {
    items: itemsOfList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (itemId, listId) => { dispatch( deleteItem(listId, itemId) ) },
    updateState: (newState) => { dispatch( updateState(newState) ) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoItem)
