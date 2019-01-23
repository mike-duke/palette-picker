const button = document.querySelector('.new-palette');

const generateColor = () => {
  let color = '#'
  const hexCode = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'];
  for(let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * hexCode.length);
    let newValue = hexCode[randomIndex];
    color += newValue;
  }
  return color;
}

const handleNewPalette = (event) => {
  const boxes = document.querySelectorAll('.color-box');
  const hexes = document.querySelectorAll('.hexcode');
  boxes.forEach((box, i) => {
    const color = generateColor();
    box.style.background = color;
    hexes[i].innerText = color;
  });
}

button.addEventListener('click', handleNewPalette);