class VNode {
    /**
     * 构造函数
     * @param tag 当前节点的标签名
     * @param data 当前节点的一些数据信息，props，attrs等
     * @param children 当前节点的子节点，数组
     * @param text 当前节点的文本
     * @param elm 对应的真实dom节点
     */
    constructor(tag, data, children, text, elm) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
    }
}

/**
 * 创建空节点
 */
function createEmptyVNode() {
    const node = new VNode();
    node.text = '';
    return node;
}

/**
 * 创建文本节点
 */
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val))
}

/**
 * 克隆节点
 * @param node
 */
function cloneVNode(node) {
    const cloneVnode = new VNode(
        node.tag, node.data, node.children, node.text, node.elm
    );
    return cloneVnode;
}
