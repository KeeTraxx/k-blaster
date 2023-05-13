export function cableport(node: Element) {
    
    node.addEventListener('mousedown', () => console.log('cableport down'));

    document.addEventListener('mouseup', () => console.log('cableport up'));

    return {
        destroy() {

        }
    }
}