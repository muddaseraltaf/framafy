export async function GET(request: Request, context: any) {
  // Extract ID gracefully to avoid Next.js 15+ synchronous context warnings
  const params = await context.params;
  const arId = params.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  // We return a pure, ultra-fast raw HTML string that bypasses React's VDOM entirely. 
  // This allows A-Frame and AR.js to seize control of the camera and DOM safely.
  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">
    <title>Your AR Balloon Experience 🎈</title>
    
    <!-- Ultra-lightweight WebGL Core -->
    <script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>
    
    <!-- Gyroscope & Magic Window Polyfills for broad iOS/Android support -->
    <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
    
    <style>
      body, html { margin: 0; padding: 0; overflow: hidden; background-color: #111; font-family: -apple-system, sans-serif; }
      
      /* Camera feed injected by device. We overlay instructions. */
      #ar-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
      }
      
      #loading-box {
        background: rgba(0,0,0,0.8); color: white; padding: 30px; rounded-3xl;
        border-radius: 24px; text-align: center; backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1); transition: opacity 0.5s;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      }
      
      .spinner {
        border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #FF4B4B; 
        border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;
      }
      
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      
      #camera-activate {
         display: none; padding: 15px 30px; background: white; color: black; font-weight: bold; border-radius: 50px;
         pointer-events: auto; cursor: pointer; text-decoration: none; border: none; margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <!-- Access device camera via HTML5 MediaDevices -> video element background -->
    <video id="webcam" autoplay playsinline muted style="position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; z-index: -1;"></video>

    <div id="ar-overlay">
      <div id="loading-box">
        <div class="spinner" id="spinner"></div>
        <h2 style="margin: 0; font-size: 24px; margin-bottom: 8px;">🎈 Loading Magic</h2>
        <p style="margin: 0; color: #aaa; font-size: 14px;">Fetching your photos...</p>
        <button id="camera-activate" onclick="startCamera()">Tap to Open Camera</button>
      </div>
    </div>

    <script>
      // 1. Manually boot the device camera for Magic Window AR
      async function startCamera() {
        document.getElementById('camera-activate').style.display = 'none';
        document.getElementById('spinner').style.display = 'block';
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }});
          document.getElementById('webcam').srcObject = stream;
          document.getElementById('loading-box').style.opacity = '0';
          setTimeout(() => document.getElementById('loading-box').style.display = 'none', 500);
        } catch(e) {
          alert('Camera required for AR experience. Please allow access.');
          document.getElementById('camera-activate').style.display = 'block';
          document.getElementById('spinner').style.display = 'none';
        }
      }

      // 2. A-Frame Logic
      const API_BASE = "${baseUrl}";
      const AR_ID = "${arId}";

      AFRAME.registerComponent('balloon-orchestrator', {
        init: function () {
          fetch(API_BASE + '/outputs/' + AR_ID + '/manifest.json')
            .then(res => res.json())
            .then(data => {
               document.getElementById('camera-activate').style.display = 'block';
               document.getElementById('spinner').style.display = 'none';
               // Spawn balloons into the 3D scene
               this.createBalloons(data.photos);
            })
            .catch(err => {
               document.querySelector('#loading-box h2').innerText = 'Error linking photos :(';
               document.getElementById('spinner').style.display = 'none';
            });
        },
        createBalloons: function (photos) {
          const scene = this.el;
          const colors = ['#FF4B4B', '#FFD166', '#00D26A', '#00C0F2', '#A358DF', '#FF9F1C'];
          
          photos.forEach((photoUrl, index) => {
             const balloonEntity = document.createElement('a-entity');
             
             // Wrap around the user in a large circle, pushed 3-6 meters out.
             const angle = (index / photos.length) * Math.PI * 2;
             const radius = 4.0; 
             const x = Math.cos(angle) * radius;
             const z = -4.0 + (Math.sin(angle) * 2.0); // Center around -4z (in front of user's initial spawn)
             
             // Spawn at foot level (y = -1.5m)
             balloonEntity.setAttribute('position', \`\${x} -1.5 \${z}\`);
             
             // 3D Geometry
             const sphere = document.createElement('a-sphere');
             sphere.setAttribute('radius', '0.6');
             sphere.setAttribute('color', colors[index % colors.length]);
             sphere.setAttribute('material', 'metalness: 0.3; roughness: 0.2; opacity: 0.95');
             sphere.setAttribute('position', '0 2 0');

             // The subtle tail string
             const stringPath = document.createElement('a-cylinder');
             stringPath.setAttribute('radius', '0.005');
             stringPath.setAttribute('height', '2.5');
             stringPath.setAttribute('color', '#ffffff');
             stringPath.setAttribute('position', '0 0.5 0');
             stringPath.setAttribute('material', 'opacity: 0.5');

             // The Photo Canvas
             const img = document.createElement('a-image');
             // Format full URL
             img.setAttribute('src', photoUrl.startsWith('http') ? photoUrl : API_BASE + photoUrl);
             img.setAttribute('width', '1.2');
             img.setAttribute('height', '1.2');
             img.setAttribute('position', '0 -1.0 0');
             // Look directly at camera (0 0 0)
             img.setAttribute('look-at', '[camera]');

             balloonEntity.appendChild(sphere);
             balloonEntity.appendChild(stringPath);
             balloonEntity.appendChild(img);
             
             // Float upward slowly
             const floatTarget = 1.5 + Math.random() * 2.0; // Stop between 1.5 and 3.5m high
             const floatDur = 6000 + (Math.random() * 4000); // 6-10 seconds to float up

             balloonEntity.setAttribute('animation__float', \`property: position; to: \${x} \${floatTarget} \${z}; dur: \${floatDur}; easing: easeOutQuint;\`);
             
             // Bobbing oscillation
             balloonEntity.setAttribute('animation__bob', \`property: position; to: \${x} \${floatTarget + 0.3} \${z}; dur: 3000; dir: alternate; loop: true; easing: easeInOutSine; delay: \${floatDur}\`);

             scene.appendChild(balloonEntity);
          });
        }
      });
    </script>

    <!-- Transparent 3D scene overlaid cleanly over physical camera feed -->
    <a-scene balloon-orchestrator vr-mode-ui="enabled: false" background="transparent">
      <!-- Lighting to make balloons look rubbery/realistic -->
      <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
      <a-light type="directional" color="#ffffff" intensity="0.8" position="-1 2 1"></a-light>
      
      <!-- Virtual Camera at origin -->
      <a-entity camera look-controls position="0 1.6 0"></a-entity>
    </a-scene>
  </body>
</html>
  `;

  return new Response(htmlContent, {
    headers: {
      "Content-Type": "text/html",
      // Important to bypass caching for dynamic manifests
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
