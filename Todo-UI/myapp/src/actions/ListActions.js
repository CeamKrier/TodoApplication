export const addItemToList = (listIndex, task) => {
  return {
    type: 'ADD_TASK',
    data:
    {
      'task': task,
      'listIndex': listIndex
    }
  }
}
