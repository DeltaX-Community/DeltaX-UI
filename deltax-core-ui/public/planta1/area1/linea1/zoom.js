

function zoomWheel(target) {
    return {
        scale: 1,
        target: target, 
        callback: function (event) {
            event.preventDefault();

            const delta = Math.min(Math.max(0.02, Math.abs(event.deltaY * -0.01)), 0.2)
            this.scale += event.deltaY < 0 ? -delta : +delta;
            this.scale = Math.min(Math.max(0.5, this.scale), 2) 

            // Apply scale transform
            this.target.style.transformOrigin = this.scale < 1 ? "" : `${event.layerX}px ${event.layerY}px`
            this.target.style.transform = `scale(${this.scale})`;
        }
    }
}

const els = document.getElementsByClassName('zoom-wheel');
for (const el of els) {
 
    const f = zoomWheel(el)
    el.addEventListener("wheel", function (e) {
        f.callback(e)
    });
    console.log("zoom-wheel for", el) 
}