const videoPlayer = document.getElementById('video');
const scrubberControl = document.getElementById('scrubberControl');
const volumeControl = document.getElementById('volumeControl');
const playBtn = document.getElementById('playBtn');
const rewindBtn = document.getElementById('rewindBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Enumerator for keeping track of slider control states
const SLIDER_CTRL_STATE = Object.freeze({
  ENGAGED: 'ENGAGED',
  DISENGAGED: 'DISENGAGED'
});

// Unicode character constants for play/pause
const PLAY_TEXT = '▶';
const PAUSE_TEXT = '❚❚';

// Initialise slider control states
let scrubberControlState = SLIDER_CTRL_STATE.DISENGAGED;
let volumeControlState = SLIDER_CTRL_STATE.DISENGAGED;

/**
 * Handles UI updates on video play or pause.
 * @param {any} event The video element playing or pause event.
 */
function handleVideoStateChange(event) {
  setPlayBtnIconByVideoStatus();
}

/**
 * Handles UI updates on video progress.
 * @param {any} event The video element timeupdate event.
 */
function handleVideoProgress(event) {
  const nextTimePercent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  document.documentElement.style.setProperty('--scrubber-progress', `${nextTimePercent}%`);
}

/**
 * Requests the video to be fullscreen.
 * @param {any} event The fullscreen button event.
 */
function requestFullScreenVideo(event) {
  videoPlayer.requestFullscreen();
}

/**
 * Sets the play button icon based on whether the video has been paused
 * or played/resumed.
 */
function setPlayBtnIconByVideoStatus() {
  playBtn.textContent = videoPlayer.paused ? PLAY_TEXT : PAUSE_TEXT;
}

/**
 * Event handler for playing/pausing the video
 * @param {any} event The play button click event.
 */
function handlePlayControlClick(event) {
  videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
}

/**
 * Event handler for rewinding the video.
 * @param {any} event The rewind button click event.
 */
function handleRewindControlClick(event) {
  const nextTime = Math.max(0, videoPlayer.currentTime - 10);
  const nextTimePercent = (nextTime / videoPlayer.duration) * 100;
  document.documentElement.style.setProperty('--scrubber-progress', `${nextTimePercent}%`);
  scrubberControl.value = nextTime / videoPlayer.duration;
  videoPlayer.currentTime = nextTime;
}

/**
 * Updates the video current time and video player UI accordingly to a fraction of progress.
 * @param {number} progress The video progress fraction [0, 1] to use in updating the video current time and UI.
 */
function setNewVideoTime(progress) {
  const nextTime = progress * videoPlayer.duration;
  const nextTimePercent = progress * 100;
  document.documentElement.style.setProperty('--scrubber-progress', `${nextTimePercent}%`);
  videoPlayer.currentTime = nextTime;
}

/**
 * Event handler for updating the video progress on scrub.
 * @param {any} event The scrubber input change event.
 */
function handleScrubberChange(event) {
  if (scrubberControlState !== SLIDER_CTRL_STATE.ENGAGED) {
    return;
  }
  setNewVideoTime(event.target.value);
}

/**
 * Event handler for engaging the control state of the scrubbing slider
 * and updating the video progress on the user's scrubber input engagement.
 * @param {any} event The scrubber input event.
 */
function handleScrubberEngage(event) {
  scrubberControlState = SLIDER_CTRL_STATE.ENGAGED;
  setNewVideoTime(event.target.value);
}

/**
 * Event handler for disengaging the scrubber.
 * @param {any} event The scrubber input event.
 */
function handleScrubberDisengage(event) {
  scrubberControlState = SLIDER_CTRL_STATE.DISENGAGED;
}

/**
 * Updates the video volume and video player UI according to the new volume level.
 * @param {number} levelValue The video volume level [0, 1] to use in updating the video volume and UI.
 */
function setNewVideoVolume(levelValue) {
  const nextVolume = levelValue;
  const nextVolumePercent = nextVolume * 100;
  document.documentElement.style.setProperty('--volume-level', `${nextVolumePercent}%`);
  videoPlayer.volume = nextVolume;
}

/**
 * Event handler for updating the video volume on volume change.
 * @param {any} event The volume input change event.
 */
function handleVolumeChange(event) {
  if (volumeControlState !== SLIDER_CTRL_STATE.ENGAGED) {
    return;
  }
  setNewVideoVolume(event.target.value);
}

/**
 * Event handler for engaging the control state of the volume slider
 * and updating the video volme on the user's volume input engagement.
 * @param {any} event The volume input event.
 */
function handleVolumeEngage(event) {
  volumeControlState = SLIDER_CTRL_STATE.ENGAGED;
  setNewVideoVolume(event.target.value);
}

/**
 * Event handler for disengaging the volume input.
 * @param {any} event The volume input event.
 */
function handleVolumeDisengage(event) {
  volumeControlState = SLIDER_CTRL_STATE.DISENGAGED;
}

// Event listener specifications for user interaction 
videoPlayer.addEventListener('playing', handleVideoStateChange);
videoPlayer.addEventListener('pause', handleVideoStateChange);
videoPlayer.addEventListener('timeupdate', handleVideoProgress);
playBtn.addEventListener('click', handlePlayControlClick);
rewindBtn.addEventListener('click', handleRewindControlClick);
fullscreenBtn.addEventListener('click', requestFullScreenVideo);
scrubberControl.addEventListener('mousedown', handleScrubberEngage);
scrubberControl.addEventListener('mouseup', handleScrubberDisengage);
scrubberControl.addEventListener('input', handleScrubberChange);
volumeControl.addEventListener('mousedown', handleVolumeEngage);
volumeControl.addEventListener('mouseup', handleVolumeDisengage);
volumeControl.addEventListener('input', handleVolumeChange);
