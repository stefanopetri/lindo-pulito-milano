const canvas = document.getElementById("cleanCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const dirty = new Image();

    dirty.src = "divano-sporco.PNG?v=2";

    dirty.onload = () => {

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.drawImage(dirty, 0, 0, canvas.width, canvas.height);

    };

}
