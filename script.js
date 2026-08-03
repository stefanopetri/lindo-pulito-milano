const canvas = document.getElementById("cleanCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const dirty = new Image();
    dirty.src = "divano-sporco.PNG?v=3";

    let drawing = false;

    dirty.onload = () => {

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.drawImage(dirty,0,0,canvas.width,canvas.height);

    };

    function erase(x,y){

        ctx.globalCompositeOperation="destination-out";

        ctx.beginPath();
        ctx.arc(x,y,45,0,Math.PI*2);
        ctx.fill();

    }

    function position(e){

        const rect=canvas.getBoundingClientRect();

        if(e.touches){

            return{
                x:e.touches[0].clientX-rect.left,
                y:e.touches[0].clientY-rect.top
            };

        }

        return{
            x:e.clientX-rect.left,
            y:e.clientY-rect.top
        };

    }

    canvas.addEventListener("mousedown",()=>drawing=true);
    canvas.addEventListener("mouseup",()=>drawing=false);
    canvas.addEventListener("mouseleave",()=>drawing=false);

    canvas.addEventListener("mousemove",(e)=>{

        if(!drawing) return;

        const p=position(e);

        erase(p.x,p.y);

    });

    canvas.addEventListener("touchstart",(e)=>{

        drawing=true;

        const p=position(e);

        erase(p.x,p.y);

    });

    canvas.addEventListener("touchmove",(e)=>{

        e.preventDefault();

        if(!drawing) return;

        const p=position(e);

        erase(p.x,p.y);

    },{passive:false});

    canvas.addEventListener("touchend",()=>drawing=false);

}
