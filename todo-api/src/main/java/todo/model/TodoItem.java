package todo.model;

import java.text.SimpleDateFormat;
import java.util.*;

import todo.model.identifier.DependencyIdentifier;

public class TodoItem {
	
	private SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
	private Date d = new Date();

	private String name;
	private String description;
	private String deadline;
	private boolean status;
	private String createdAt = sdf.format(d);
	private List<DependencyIdentifier> dependsOn = new ArrayList<DependencyIdentifier>();
	private String completedAt;
	
	public TodoItem() {}
	
	public TodoItem(String name, String description) {
		this.name = name;
		this.description = description;
		this.status = false;
	}
	
	public String getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(String completedAt) {
		this.completedAt = completedAt;
	}

	public List<DependencyIdentifier> getDependsOn() {
		return dependsOn;
	}

	public void setDependsOn(List<DependencyIdentifier> dependsOn) {
		this.dependsOn = dependsOn;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDeadline() {
		return deadline;
	}

	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}
	
}
