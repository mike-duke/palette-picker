const button = document.querySelector('.change-color');
const colorBox = document.querySelector('.color-box1');

const generateColor = () => {
  let color = ''
  const hexCode = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
  for(let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * hexCode.length);
    let newValue = hexCode[randomIndex];
    color += newValue;
  }
  return color;
}

const handleClick = (event) => {
  const color = generateColor();
  colorBox.style.background = `#${color}`;
  colorBox.innerText = `#${color}`
}

// button.addEventListener('click', handleClick);