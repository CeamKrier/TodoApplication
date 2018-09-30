package todo.model;

import java.util.*;

public class TodoList {

	private String name;
	private List<TodoItem> items;
	
	public TodoList() {}
	
	public TodoList(String name) {
		this.name = name;
		this.items = new ArrayList<TodoItem>();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<TodoItem> getItems() {
		return items;
	}

	public void setItems(List<TodoItem> items) {
		this.items = items;
	}
	
	
}
