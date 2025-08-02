import handFBXFileUrl from '../ComfyUI_3dPoseEditor/assets/hand.fbx?url'
import footFBXFileUrl from '../ComfyUI_3dPoseEditor/assets/foot.fbx?url'
import posesLibraryUrl from './ComfyUI_3dPoseEditor/assets/data.bin?url'

export default {
    'models/hand.fbx': handFBXFileUrl,
    'models/foot.fbx': footFBXFileUrl,
    'src/poses/data.bin': posesLibraryUrl,
    'pose_landmark_full.tflite':'./assets/pose/pose_landmark_full.tflite',
    'pose_solution_packed_assets.data':'./assets/pose/pose_solution_packed_assets.data',
    'pose_solution_packed_assets_loader.js':'./assets/pose/pose_solution_packed_assets_loader.js',
    'pose_solution_simd_wasm_bin.js':'./assets/pose/pose_solution_simd_wasm_bin.js',
    'pose_solution_simd_wasm_bin.wasm':'./assets/pose/pose_solution_simd_wasm_bin.wasm',
    'pose_web.binarypb': './assets/pose/pose_web.binarypb',
}
