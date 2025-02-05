import { makeRandGLSL, isClose, sdAxisAlignedRect } from './utils'

export default function(regl) {
    return regl({
        vert: `
            precision mediump float;
            attribute vec2 xy;
            varying vec2 uv;
            void main () {
                uv = xy * 0.5 + 0.5;
                uv.y = 1.0-uv.y;
                gl_Position = vec4(xy, 0, 1);
            }
        `,
        frag: `
            precision mediump float;
            varying vec2 uv;
            uniform vec4 rect;
            uniform float fillIndex;
            
            ${makeRandGLSL}
            ${sdAxisAlignedRect}

            void main () {
                vec4 rectNormed = vec4(rect.x, 1.0 - rect.w, rect.z, 1.0 - rect.y);
                // vec4 rectNormed = rect;
                float rectDist = sdAxisAlignedRect(uv, rectNormed.xy, rectNormed.zw);
                float rand = makeRand(uv);
                
                if (rectDist < -0.1) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                } else if (rectDist < 0. && rand > .8) {
                    if (fillIndex == 0.0) {
                        gl_FragColor = vec4(.5, .25, 1.0, 0.0);
                    } else {
                        gl_FragColor = vec4(1.0, 0.0, .5, .25);
                    }
                } else {
                    // Outside.
                    discard;
                }
            }
        `,
        attributes: {xy: [-4, -4, 0, 4, 4, -4]},
        uniforms: {
            rect: regl.prop('rect'),
            fillIndex: regl.prop('fillIndex')
        },
        framebuffer: regl.prop('dst'),
        depth: { enable: false },
        count: 3,
    });
}