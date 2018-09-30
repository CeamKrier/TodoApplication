package todo.model.identifier;

import todo.model.TodoItem;

public class ObjectWrapper {

	private IndexIdentifier listIndex;
	private IndexIdentifier itemIndex;
	private TodoItem item;
	private TimeIdentifier completedAt;
	
	
	public ObjectWrapper() {}
	
	public ObjectWrapper(IndexIdentifier itemIndex, IndexIdentifier listIndex) {
		this.itemIndex = itemIndex;
		this.listIndex = listIndex;
	}
	
	public ObjectWrapper(IndexIdentifier itemIndex, TodoItem item) {
		this.itemIndex = itemIndex;
		this.item = item;
	}
	
	public ObjectWrapper(IndexIdentifier itemIndex, IndexIdentifier listIndex, TimeIdentifier completedAt) {
		this.itemIndex = itemIndex;
		this.listIndex = listIndex;
		this.completedAt = completedAt;
	}
	
	public TimeIdentifier getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(TimeIdentifier completedAt) {
		this.completedAt = completedAt;
	}

	public IndexIdentifier getListIndex() {
		return listIndex;
	}

	public void setListIndex(IndexIdentifier listIndex) {
		this.listIndex = listIndex;
	}

	public IndexIdentifier getItemIndex() {
		return itemIndex;
	}

	public void setItemIndex(IndexIdentifier itemIndex) {
		this.itemIndex = itemIndex;
	}

	public TodoItem getItem() {
		return item;
	}

	public void setItem(TodoItem item) {
		this.item = item;
	}
	

	
	
}
