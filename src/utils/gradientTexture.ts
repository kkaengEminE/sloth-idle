import * as THREE from 'three';

let cachedTexture: THREE.DataTexture | null = null;

export function getToonGradient(): THREE.DataTexture {
  if (cachedTexture) return cachedTexture;

  const data = new Uint8Array([
    80, 80, 80, 255,
    170, 170, 170, 255,
    255, 255, 255, 255,
  ]);
  const texture = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  cachedTexture = texture;
  return texture;
}
