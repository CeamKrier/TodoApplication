package todo.application;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import todo.model.*;
import todo.model.identifier.DependencyIdentifier;
import todo.model.identifier.IndexIdentifier;
import todo.model.identifier.ObjectWrapper;

@RestController
public class ApiController {

	@Autowired
	private ApiService as;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping("/")
	public List<TodoList> getTodoLists() {
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/newList")
	public List<TodoList> getTodoLists(@RequestBody TodoList newList) {
		as.addList(newList);
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.DELETE, value = "/deleteList")
	public List<TodoList> deleteList(@RequestBody IndexIdentifier itemIndex) {
		System.out.println(itemIndex.getIndex());
		if (itemIndex.getIndex() < as.getAllLists().size()) {
			as.deleteList(itemIndex.getIndex());
		}
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/addItem")
	public List<TodoList> addItemToList(@RequestBody ObjectWrapper data) {
		as.addTodoItem(data.getListIndex().getIndex(), data.getItem());
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/deleteItem")
	public List<TodoList> deleteItemFromList(@RequestBody ObjectWrapper data) {
		as.deleteTodoItem(data.getListIndex().getIndex(), data.getItemIndex().getIndex());
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/taskCompleted")
	public List<TodoList> markItemAsCompleted(@RequestBody ObjectWrapper data) {
		as.markCompletedTodoItem(data.getListIndex().getIndex(), data.getItemIndex().getIndex(), data.getCompletedAt().getTime());
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/taskNotCompleted")
	public List<TodoList> markItemAsNotCompleted(@RequestBody ObjectWrapper data) {
		as.markUncompletedTodoItem(data.getListIndex().getIndex(), data.getItemIndex().getIndex());
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/addDependency")
	public List<TodoList> addDependencyToItem(@RequestBody DependencyIdentifier data) {
		as.makeAnItemDependent(data);
		return as.getAllLists();
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(method = RequestMethod.POST, value = "/removeDependency")
	public List<TodoList> removeDependencyFromItem(@RequestBody ObjectWrapper data) {
		as.deleteAnItemsDependency(data.getListIndex().getIndex(), data.getItemIndex().getIndex());
		return as.getAllLists();
	}
}
