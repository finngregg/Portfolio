import CoreImage
import Foundation
import ImageIO
import UniformTypeIdentifiers
import Vision

// cutout <in> <outDir> <width> <height>: crops to the aspect, centred, then writes photo.png and people.png
let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
let W = CGFloat(Double(args[3])!), H = CGFloat(Double(args[4])!)

let ctx = CIContext()
var img = CIImage(contentsOf: url, options: [.applyOrientationProperty: true])!
let e = img.extent
let cropW = min(e.width, e.height * W / H)
let cropH = cropW * H / W
img = img.cropped(to: CGRect(x: e.minX + (e.width - cropW) / 2, y: e.minY + (e.height - cropH) / 2, width: cropW, height: cropH))
img = img.transformed(by: CGAffineTransform(translationX: -img.extent.minX, y: -img.extent.minY))
img = img.transformed(by: CGAffineTransform(scaleX: W / cropW, y: H / cropH))
let cg = ctx.createCGImage(img, from: CGRect(x: 0, y: 0, width: W, height: H))!

func write(_ image: CGImage, _ name: String) {
  let dest = CGImageDestinationCreateWithURL(outDir.appendingPathComponent(name) as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, image, nil)
  CGImageDestinationFinalize(dest)
}
write(cg, "photo.png")

let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg)
try handler.perform([req])
guard let obs = req.results?.first else { fatalError("no foreground found") }
print("instances: \(obs.allInstances.count)")
let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
let masked = CIImage(cvPixelBuffer: buf)
write(ctx.createCGImage(masked, from: masked.extent)!, "people.png")
