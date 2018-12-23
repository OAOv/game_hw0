function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (scene.targets.length > 0)
        timer++;

      for(var i = 0; i < scene.obstacles.length; i++) {
        if(scene.obstacles[i].center.distanceTo (agent.pos) <= scene.obstacles[i].size)
          timer += 5;
      }
  }, 1000);
}

window.onload = function () {
  var fiveMinutes = 0,
      display = document.querySelector('#time');
  startTimer(fiveMinutes, display);
};