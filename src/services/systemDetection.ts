import { SystemSpecs } from '../types';

export async function detectSystemSpecs(): Promise<SystemSpecs> {
  try {
    // Try using WebGL for GPU detection
    const gpuInfo = await detectGPU();
    console.log('Detected GPU:', gpuInfo);

    // Try using navigator for CPU detection
    const cpuInfo = await detectCPU();
    console.log('Detected CPU:', cpuInfo);

    // Get monitor information
    const monitorInfo = await detectMonitor();
    console.log('Detected Monitor:', monitorInfo);

    // Get memory information
    const ramSize = await detectRAM();
    console.log('Detected RAM:', ramSize);

    return {
      cpu: cpuInfo,
      gpu: gpuInfo,
      ram: ramSize,
      storage: 'nvme',
      monitor: monitorInfo
    };
  } catch (error) {
    console.error('System detection failed:', error);
    throw new Error('Failed to detect system specifications');
  }
}

async function detectGPU(): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      throw new Error('WebGL not supported');
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      throw new Error('WEBGL_debug_renderer_info not supported');
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    console.log('GPU Info:', { vendor, renderer });

    // Map to known GPUs
    if (renderer.includes('RTX')) {
      if (renderer.includes('4090')) return 'rtx4090';
      if (renderer.includes('4080')) return 'rtx4080';
      if (renderer.includes('4070')) return 'rtx4070';
      if (renderer.includes('4060')) return 'rtx4060';
    }

    if (renderer.includes('RX')) {
      if (renderer.includes('7900')) return 'rx7900xt';
      if (renderer.includes('7800')) return 'rx7800xt';
      if (renderer.includes('7700')) return 'rx7700xt';
      if (renderer.includes('7600')) return 'rx7600';
    }

    return 'rtx4070'; // Default fallback
  } catch (error) {
    console.error('GPU detection failed:', error);
    return 'rtx4070';
  }
}

async function detectCPU(): Promise<string> {
  try {
    const userAgent = navigator.userAgent;
    const hardwareConcurrency = navigator.hardwareConcurrency || 8;
    
    console.log('CPU Detection:', {
      userAgent,
      hardwareConcurrency
    });

    // Try to detect from user agent
    if (userAgent.includes('Intel')) {
      if (hardwareConcurrency >= 32) return 'i9-14900K';
      if (hardwareConcurrency >= 24) return 'i7-14700K';
      return 'i5-14600K';
    }

    if (userAgent.includes('AMD')) {
      if (hardwareConcurrency >= 32) return 'r9-7950X';
      if (hardwareConcurrency >= 16) return 'r7-7700X';
      return 'r5-7600X';
    }

    // Fallback based on core count
    if (hardwareConcurrency >= 32) return 'i9-14900K';
    if (hardwareConcurrency >= 24) return 'i7-14700K';
    return 'i5-14600K';
  } catch (error) {
    console.error('CPU detection failed:', error);
    return 'i5-14600K';
  }
}

async function detectRAM(): Promise<number> {
  try {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const totalRAM = Math.round(memory.jsHeapSizeLimit / (1024 * 1024 * 1024));
      console.log('RAM Detection:', { totalRAM });
      
      if (totalRAM >= 64) return 64;
      if (totalRAM >= 32) return 32;
      if (totalRAM >= 16) return 16;
    }
    
    // Estimate based on hardware concurrency
    const cores = navigator.hardwareConcurrency || 8;
    return Math.min(128, Math.max(16, cores * 4));
  } catch (error) {
    console.error('RAM detection failed:', error);
    return 16;
  }
}

async function detectMonitor(): Promise<{ resolution: string; refreshRate: number; hdr: boolean }> {
  try {
    const width = window.screen.width * (window.devicePixelRatio || 1);
    const height = window.screen.height * (window.devicePixelRatio || 1);
    
    console.log('Monitor Detection:', {
      width,
      height,
      devicePixelRatio: window.devicePixelRatio
    });

    // Map to common resolutions
    let resolution = '1920x1080';
    if (width >= 3840) resolution = '3840x2160';
    else if (width >= 2560) resolution = '2560x1440';
    
    // Detect refresh rate
    let refreshRate = 60;
    if ('screen' in window && (window.screen as any).refresh) {
      refreshRate = (window.screen as any).refresh;
    }
    
    // Detect through requestAnimationFrame
    if (refreshRate === 60) {
      let frames = 0;
      const startTime = performance.now();
      
      await new Promise(resolve => {
        function count(timestamp: number) {
          frames++;
          if (timestamp - startTime >= 1000) {
            refreshRate = Math.min(Math.round(frames), 360);
            resolve(undefined);
          } else {
            requestAnimationFrame(count);
          }
        }
        requestAnimationFrame(count);
      });
    }
    
    // Map to common refresh rates
    if (refreshRate >= 360) refreshRate = 360;
    else if (refreshRate >= 240) refreshRate = 240;
    else if (refreshRate >= 165) refreshRate = 165;
    else if (refreshRate >= 144) refreshRate = 144;
    else refreshRate = 60;
    
    // Detect HDR support
    const hdr = window.matchMedia('(dynamic-range: high)').matches;
    
    return {
      resolution,
      refreshRate,
      hdr
    };
  } catch (error) {
    console.error('Monitor detection failed:', error);
    return {
      resolution: '1920x1080',
      refreshRate: 60,
      hdr: false
    };
  }
}