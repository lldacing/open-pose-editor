const files: Record<string, string> = {
    'models/hand.fbx': '../ComfyUI_3dPoseEditor/assets/hand.fbx',
    'models/foot.fbx': '../ComfyUI_3dPoseEditor/assets/foot.fbx',
    'src/poses/data.bin': '../ComfyUI_3dPoseEditor/assets/data.bin',
    'pose_landmark_full.tflite':'../ComfyUI_3dPoseEditor/assets/pose/pose_landmark_full.tflite',
    'pose_solution_packed_assets.data':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_packed_assets.data',
    'pose_solution_packed_assets_loader.json':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_packed_assets_loader.json',
    'pose_solution_simd_wasm_bin.js':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_simd_wasm_bin.js',
    'pose_solution_simd_wasm_bin.wasm':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_simd_wasm_bin.wasm',
    'pose_web.binarypb': '../ComfyUI_3dPoseEditor/assets/pose/pose_web.binarypb',
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
