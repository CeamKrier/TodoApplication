package todo.model.identifier;

public class DependencyIdentifier {

	private IndexIdentifier listIndex;
	private IndexIdentifier itemIndex;
	private IndexIdentifier itemDependency;
	
	public DependencyIdentifier () {}
	
	public DependencyIdentifier (IndexIdentifier listIndex, IndexIdentifier itemIndex, IndexIdentifier itemDependency) {
		this.listIndex = listIndex;
		this.itemIndex = itemIndex;
		this.itemDependency = itemDependency;
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

	public IndexIdentifier getItemDependency() {
		return itemDependency;
	}

	public void setItemDependency(IndexIdentifier itemDependency) {
		this.itemDependency = itemDependency;
	}
	
	
}
