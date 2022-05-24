import './style.css'
import { updateImageAlts } from './updateImageAlts';

setTimeout(() => {
  const img = document.createElement('img');
  img.className = 'image';
  img.src = 'https://hsto.org/r/w1560/webt/tp/kv/vr/tpkvvrupm-c8bnldmesxhmulh9s.png';
  document.getElementById('app').appendChild(img);
}, 1000);

updateImageAlts();
