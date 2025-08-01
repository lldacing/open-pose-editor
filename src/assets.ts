import handFBXFileUrl from '../ComfyUI_3dPoseEditor/assets/hand.fbx?url'
import footFBXFileUrl from '../ComfyUI_3dPoseEditor/assets/foot.fbx?url'
import posesLibraryUrl from './ComfyUI_3dPoseEditor/assets/data.bin?url'

export default {
    'models/hand.fbx': handFBXFileUrl,
    'models/foot.fbx': footFBXFileUrl,
    'src/poses/data.bin': posesLibraryUrl,
    'pose_landmark_full.tflite':'../ComfyUI_3dPoseEditor/assets/pose/pose_landmark_full.tflite',
    'pose_solution_packed_assets.data':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_packed_assets.data',
    'pose_solution_packed_assets_loader.json':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_packed_assets_loader.json',
    'pose_solution_simd_wasm_bin.js':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_simd_wasm_bin.js',
    'pose_solution_simd_wasm_bin.wasm':'../ComfyUI_3dPoseEditor/assets/pose/pose_solution_simd_wasm_bin.wasm',
    'pose_web.binarypb': '../ComfyUI_3dPoseEditor/assets/pose/pose_web.binarypb',
}
