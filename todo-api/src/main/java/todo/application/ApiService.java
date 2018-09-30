package todo.application;

import java.util.*;

import org.springframework.stereotype.Service;

import todo.model.*;
import todo.model.identifier.DependencyIdentifier;

@Service
public class ApiService {

	private List<TodoList> lists = new ArrayList<TodoList>(Arrays.asList(new TodoList("First to-do list")));
	public HashMap<Integer, Integer> f = new HashMap<>();
	
	public void addList(TodoList li) {
		TodoList newTDL = new TodoList(li.getName());
		lists.add(newTDL);
	}
	
	public List<TodoList> getAllLists() {
		return lists;
	}
	
	public void deleteList(int index) {
		lists.remove(index);
	}
	
	public void addTodoItem(int listIndex, TodoItem ti) {
		lists.get(listIndex).getItems().add(ti);
	}
	
	public void deleteTodoItem(int listIndex, int itemIndex) {
		int res = checkDependents(listIndex, itemIndex);
		if (res == 200) {
			lists.get(listIndex).getItems().remove(itemIndex);
		}
	}
	
	public void makeAnItemDependent(DependencyIdentifier data) {
		List<TodoItem> list = lists.get(data.getListIndex().getIndex()).getItems();
		List<DependencyIdentifier> deps = list.get(data.getItemIndex().getIndex()).getDependsOn();
		if (deps.size() > 0) {
			deps.set(0, data);
		} else {
			deps.add(data);
		}
	}
	
	public void deleteAnItemsDependency(int listIndex, int itemIndex) {
		lists.get(listIndex).getItems().get(itemIndex).setDependsOn(new ArrayList<DependencyIdentifier>());
		/*
		 * 
		 * List<TodoItem> list = lists.get(data.getListIndex().getIndex()).getItems();
		List<DependencyIdentifier> dependencies = list.get(data.getItemIndex().getIndex()).getDependsOn();
		
		Iterator<DependencyIdentifier> it = dependencies.iterator();
		while(it.hasNext()) {
			DependencyIdentifier temp = it.next();
			if (temp.getListIndex().getIndex() == data.getListIndex().getIndex()
					&& temp.getItemIndex().getIndex() == data.getItemIndex().getIndex()
					&& temp.getItemDependency().getIndex() == data.getItemDependency().getIndex()) {
				it.remove();
			}
		}
		 * 
		 * */
		
	}
	
	public int checkDependents(int listIndex, int itemIndex) {
		lists.get(listIndex).getItems().forEach(item -> {
			if (item.getDependsOn().size() > 0) {
				if ((item.getDependsOn().get(0).getItemDependency().getIndex() + "").equals(itemIndex + "")) {
					deleteAnItemsDependency(listIndex, lists.get(listIndex).getItems().indexOf(item));
				}
			}
		});
		return 200;
	}
	
	public void markCompletedTodoItem(int listIndex, int itemIndex, String completedAt) {
		TodoItem item = lists.get(listIndex).getItems().get(itemIndex);
		item.setStatus(true);
		item.setCompletedAt(completedAt);
	}
	
	public void markUncompletedTodoItem(int listIndex, int itemIndex) {
		lists.get(listIndex).getItems().get(itemIndex).setStatus(false);
	}
	
}
