const files: Record<string, string> = {
    'models/hand.fbx': './assets/hand.fbx',
    'models/foot.fbx': './assets/foot.fbx',
    'src/poses/data.bin': './assets/data.bin',
    'pose_landmark_full.tflite':'./assets/pose/pose_landmark_full.tflite',
    'pose_solution_packed_assets.data':'./assets/pose/pose_solution_packed_assets.data',
    'pose_solution_packed_assets_loader.js':'./assets/pose/pose_solution_packed_assets_loader.js',
    'pose_solution_simd_wasm_bin.js':'./assets/pose/pose_solution_simd_wasm_bin.js',
    'pose_solution_simd_wasm_bin.wasm':'./assets/pose/pose_solution_simd_wasm_bin.wasm',
    'pose_web.binarypb': './assets/pose/pose_web.binarypb',
}

async function loadAssets() {
    try {
        const params = new URLSearchParams(window.location.search)
        const url = params.get('config')
        if (url?.startsWith('/')) {
            const response = await fetch(url)
            const config = await response.json()
            Object.assign(files, config['assets'])
        }
    } catch (error) {
        console.error(error)
    }
}

loadAssets()

export default files
