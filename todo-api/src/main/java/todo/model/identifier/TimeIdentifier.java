package todo.model.identifier;

public class TimeIdentifier {

	private String completedAt;
	
	public TimeIdentifier() {}
	
	public TimeIdentifier(String completedAt) {
		this.completedAt = completedAt;
	}

	public String getTime() {
		return completedAt;
	}

	public void setTime(String completedAt) {
		this.completedAt = completedAt;
	}
	
}
