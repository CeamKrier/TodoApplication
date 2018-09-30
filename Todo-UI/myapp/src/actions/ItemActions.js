export const deleteItem = (listId, itemId) => {
  return {
    type: 'DELETE_ITEM',
    data: {
      'listId': listId,
      'itemId': itemId
    }
  }
}
