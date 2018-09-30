
/**
 * {'name': 'Basic todo',
    'items': [
      {
        'name': 'Buy eggs',
        'description': 'Get 12 eggs for breakfast',
        'deadline': '02/10/2018',
        'createdAt': '24/09/2018',
        'dependsOn': [],
        'status': 'false'
      },
      {
        'name': 'Send cash to sister',
        'description': 'needs to be done before 4PM',
        'deadline': '05/10/2018',
        'createdAt': '28/09/2018',
        'dependsOn': [],
        'status': 'false'
      }
    ]},
  {'name': 'Next week',
    'items': [
      {
        'name': 'Take a walk with Jane',
        'description': 'around 9AM',
        'deadline': '02/10/2018',
        'createdAt': '24/09/2018',
        'dependsOn': [],
        'status': 'false'
      },
      {
        'name': 'Do dishes before noon',
        'description': 'yup, you heard me',
        'deadline': '05/10/2018',
        'createdAt': '28/09/2018',
        'dependsOn': [],
        'status': 'false'
      },
      {
        'name': 'Do dishes before noon',
        'description': 'yup, you heard me',
        'deadline': '05/10/2018',
        'createdAt': '28/09/2018',
        'dependsOn': [],
        'status': 'false'
      }
    ]}
 */
const initState = {
  todos: []
}

const rootReducer = (state = initState, action) => {
  if (action.type === 'INIT_STATE') {
    return {
      todos: [...action.data]
    }
  }

  if (action.type === 'UPDATE_STATE') {
    return {
      ...state,
      todos: [...action.data]
    }
  }

  if (action.type === 'DELETE_TASK') {
    let result = state.todos
    result[action.data.listId].items.splice(action.data.itemId, 1)
    return {
      ...state,
      todos: result
    }
  }

  if (action.type === 'ADD_TASK') {
    let result = state.todos
    result[action.data.listIndex].items.push(action.data.task)
    return {
      ...state,
      todos: result
    }
  }
  return state
}
export default rootReducer
