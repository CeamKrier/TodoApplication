package todo.model.identifier;

public class IndexIdentifier {

	private int index;
	
	public IndexIdentifier() {}
	
	public IndexIdentifier(String item) {
		this.index = Integer.valueOf(item);
	}
	
	public int getIndex() {
		return index;
	}

	public void setIndex(int itemIndex) {
		this.index = itemIndex;
	}
	
	
}
