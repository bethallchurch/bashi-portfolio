!(function () {
  'use strict'

  var canvas = document.querySelector('#webgl')

  var scroll = 0.0, velocity = 0.0, lastScroll = 0.0

  var regl = createREGL({
    canvas: canvas,
    onDone: function (error, regl) {
      if (error) { alert(error) }
    }
  })

  var img = new Image()
  img.src = 'img/background.jpg'
  img.onload = function () {
    setTimeout(function () { document.body.classList.remove('loading') }, 1000)
    var draw = regl({
      frag: document.querySelector('#fragmentShader').textContent,
      vert: 'attribute vec2 position; void main() { gl_Position = vec4(3.0 * position, 0.0, 1.0); }',
      attributes: { position: [-1, 0, 0, -1, 1, 1] },
      count: 3,
      uniforms: {
        globaltime: regl.prop('globaltime'),
        resolution: regl.prop('resolution'),
        aspect: regl.prop('aspect'),
        scroll: regl.prop('scroll'),
        velocity: regl.prop('velocity'),
        texture: regl.texture(img)
      }
    })

    regl.frame(function (ctx) {
      var aspect = canvas.scrollWidth / canvas.scrollHeight
      canvas.width = 1024 * aspect
      canvas.height = 1024
      scroll = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)
      regl.clear({ color: [0, 0, 0, 0] })
      draw({
        globaltime: ctx.time,
        resolution: [ctx.viewportWidth, ctx.viewportHeight],
        aspect: aspect,
        scroll: scroll,
        velocity: velocity
      })
    })
  }
}())
