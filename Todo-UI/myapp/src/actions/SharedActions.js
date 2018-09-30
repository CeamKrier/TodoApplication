export const updateState = (newState) => {
  return {
    type: 'UPDATE_STATE',
    data: newState
  }
}
