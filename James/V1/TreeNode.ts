export class TreeNode {
    left: TreeNode | undefined;
    right: TreeNode | undefined;
    data: number;

    constructor(docId : number){
        this.data = docId;
    }

    insert(docId : number) {
        if (docId > this.data){
            if (this.right === undefined){
                this.right = new TreeNode(docId);
            }
            else {
                this.right.insert(docId);
            }
        }
        else if (docId < this.data){
            if (this.left === undefined){
                this.left = new TreeNode(docId);
            }
            else {
                this.left.insert(docId);
            }
        }

        else {
            return;
        }
    }

    extract(): Array<number> {
        let stack : Array<TreeNode> = [];
        let node : TreeNode | undefined = this;
        let documents : Array<number> = [];

        while (stack.length > 0 || node != undefined){

            if (node != undefined){
                stack.push(node);
                node = node.left
            }
            else {
                node = stack.pop();
                if (node != undefined){ //not really required by TS is not happy about this not being here.
                    documents.push(node.data);
                    node = node.right;
                }                
            }

        }

        return documents;
    }


}