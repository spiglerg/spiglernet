function $() {
  if (arguments.length == 0) return null;
  if (arguments.length == 1) return document.getElementById(arguments[0]);
  var ret = [];

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string') element = document.getElementById(arguments[i]);
    ret.push(element);
  }

  return ret;
}

function scroll_to(id) {
  smooth_scroll_to($(id).offsetTop, 600);
}

var smooth_scroll_to = function(target, duration) {
  target = Math.round(target);
  duration = Math.round(duration);

  if (duration <= 0) return;

  var start_time = Date.now();
  var end_time = start_time + duration;

  var start_top = window.pageYOffset;
  var distance = target - start_top;

  var smooth_step = function(start, end, point) {
    if(point <= start) { return 0; }
    if(point >= end) { return 1; }
    var x = (point - start) / (end - start); // interpolation
    return x*x*(3 - 2*x);
  }

  return new Promise(function(resolve, reject) {
    var previous_top = window.pageYOffset;

      var scroll_frame = function() {
      if(window.pageYOffset != previous_top) {
        reject("interrupted");
        return;
      }

      var now = Date.now();
      var point = smooth_step(start_time, end_time, now);
      window.scrollTo(0, start_top + Math.round(distance*point));

      if(now >= end_time) {
        resolve();
        return;
      }

      var frameTop = Math.round(start_top + (distance * point));
      if(window.pageYOffset === previous_top && window.pageYOffset !== frameTop) {
        resolve();
        return;
      }
      previous_top = window.pageYOffset;

      setTimeout(scroll_frame, 0);
    }

    setTimeout(scroll_frame, 0);
  });
}

window.onload = function() {
  children = document.getElementsByTagName('main')[0].children;
  var i;
  for (i = 0; i < children.length; i++) {
    if (children[i].tagName == 'DIV')
      if (children[i].offsetTop - window.pageYOffset <= window.innerHeight - 100)
        children[i].style.opacity = 1;
  }
}

window.onscroll = function() {
  children = document.getElementsByTagName('main')[0].children;
  var i;
  for (i = 0; i < children.length; i++) {
    if ((children[i].tagName == 'DIV') && (children[i].id != "footer")) {
      if (children[i].offsetTop - window.pageYOffset <= window.innerHeight - 100)
        children[i].style.opacity = 1;
      if (children[i].offsetTop - window.pageYOffset >= window.innerHeight - 200)
        children[i].style.opacity = 0;
    } else if ((children[i].tagName == 'DIV') && (children[i].id == "footer")) {
      if (children[i].offsetTop - window.pageYOffset <= window.innerHeight - 50)
        children[i].style.opacity = 1;
      if (children[i].offsetTop - window.pageYOffset >= window.innerHeight - 100)
        children[i].style.opacity = 0;
    }
  }

  if (window.pageYOffset > window.innerHeight) {
    $('toplink').style.transform = 'rotate(0deg)';
    $('toplink').style.opacity = 1;
  } else {
    $('toplink').style.transform = 'rotate(90deg)';
    $('toplink').style.opacity = 0;
  }
}

var send_email = function() {
  var xhttp;
  if (window.XMLHttpRequest) xhttp = new XMLHttpRequest();
  else xhttp = new ActiveXObject("Microsoft.XMLHTTP");

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      document.body.style.overflow = 'hidden';
      $('notify_text').innerHTML = 'The email has been sent.';
      $('notify').style.visibility = 'visible';
      $('notify').style.opacity = 1;
    }
  };

  xhttp.open("POST", "send_email.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("email=" + $('email') + "&msg=" + $('msg'));
}

var dismiss = function() {
  $('notify').style.visibility = 'hidden';
  $('notify').style.opacity = 0;
  document.body.style.overflow = 'scroll';
}
