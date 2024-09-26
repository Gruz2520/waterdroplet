import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:waterdroplet_s/moduls/api.dart';
import 'package:waterdroplet_s/pages/preview_page.dart';
import 'package:flutter/services.dart';
import '../main.dart';
import 'dart:math';

class CameraPage extends StatefulWidget {
  const CameraPage({Key? key}) : super(key: key);


  @override
  State<CameraPage> createState() => _CameraPageState();
}

class _CameraPageState extends State<CameraPage> {
  late CameraController _cameraController;
  CameraController? controller;
  late Future<String> fullName;
  FlashMode _currentFlashMode = FlashMode.off;
  late Future<bool> isInitCamera;
  bool isInited = false;
  final storage = new FlutterSecureStorage();
  final api = ApiService();

  Future<String> getFullName() async {
    String? token = await storage.read(key: "TOKEN");
    List res = await api.userInfo(token.toString());
    if (res[0] == 200){
      return res[1].toString();
    }
    else{
      return "Ошибка";
    }
  }

  void exit() async {
    storage.delete(key: "TOKEN");
    storage.delete(key: "KEY_PASS");
    Navigator.pushNamedAndRemoveUntil(context, '/auth', (route) => false);
  }

  void showinfo(context, String message) {
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            backgroundColor: Colors.white,
            title: const Text("Подсказка", style: TextStyle(color: Color(0xff2b59d3)),),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(
                  child: Text(
                    message,
                    style: const TextStyle(color: Color(0xff2b59d3)),
                  ),
                ),
              ],
            ),
            actionsAlignment: MainAxisAlignment.center,
            actions: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 15.0),
                child: Row(
                  children: [
                    Expanded(
                      child: SizedBox(
                        height: 60,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xff2b59d3),
                            shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(12)
                                          )
                          ),
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: const Text(
                            "Ок",
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        });
  }

  @override
  void dispose() {
    controller!.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    isInitCamera = initCamera(cameras[0]);
    fullName = getFullName();
  }
 
  void onViewFinderTap(TapDownDetails details, BoxConstraints constraints) {
    final offset = Offset(
      details.localPosition.dx / constraints.maxWidth,
      details.localPosition.dy / constraints.maxHeight,
    );
    controller!.setExposurePoint(offset);
    controller!.setFocusPoint(offset);
  }

  Future takePicture1() async {
    print("entered into takePicture");
    if (!controller!.value.isInitialized) {
      print("First block");
      return null;
    }
    if (controller!.value.isTakingPicture) {
      print("Second block");
      return null;
    }
    try {
      //await _cameraController.setFlashMode(_currentFlashMode);
      print("trying to take picture");
      XFile picture = await controller!.takePicture();
      print("taked picture");
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => PreviewPage(
                    picture: picture,
                  )));
      controller!.setFlashMode(FlashMode.off);
    } on CameraException catch (e) {
      debugPrint('Error occured while taking picture: $e');
      return null;
    }
  }

  Future<bool> initCamera(CameraDescription cameraDescription) async {
    final previousCameraController = controller;
    _cameraController =
        CameraController(cameraDescription, ResolutionPreset.high);

    await previousCameraController?.dispose();

    setState(() {
        controller = _cameraController;
      });
    try {
      await controller!.initialize().then((_) async {
        await controller!.lockCaptureOrientation();
        controller!.setFlashMode(FlashMode.off);
      });
      return true;
    } on CameraException catch (e) {
      debugPrint("camera error $e");
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
    ]);
    return Scaffold(
        body: SafeArea(
      child: Stack(children: [
        FutureBuilder(future: isInitCamera, builder: (context, snapshot){
          if (snapshot.hasData){
            return CameraPreview(controller!);
          }
          else{
            return Container(
                color: Colors.black,
                child: const Center(child: CircularProgressIndicator()));
          }
        }),
        Align(
          alignment: Alignment.topLeft,
          child: Transform.rotate(
            angle: 180*pi / 180,
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: IconButton(
                icon: const Icon(
                  Icons.exit_to_app_rounded,
                  size: 40,
                  color: Colors.white,
                ),
                onPressed: () {
                  exit();
                },
              ),
            ),
          ),
        ),
        Align(
          alignment: Alignment.topCenter,
          child: FutureBuilder(future: fullName, builder: (context, snapshot){
            if (snapshot.hasData){
              return Padding(
                padding: const EdgeInsets.fromLTRB(0, 24, 0, 0),
                child: Text(
                  snapshot.data.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 25,
                    fontWeight: FontWeight.bold
                    ),),
              );
            }
            else{
              return const Padding(
                padding: EdgeInsets.fromLTRB(0, 24, 0, 0),
                child: Text(
                  "Загрузка",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 25,
                    fontWeight: FontWeight.bold
                    ),),
              );
            }
          })
        ),
        Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: MediaQuery.of(context).size.height * 0.20,
              decoration: const BoxDecoration(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  color: Color(0xff2b59d3)),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 35),
                child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: () {
                          showinfo(context,
                              'Для сдачи показаний счетчиков наведите камеру на лицевую сторону счетчика и сделайте фотографию.');
                        },
                        icon: const Icon(
                          Icons.info_outline_rounded,
                          size: 35,
                          color: Colors.white,
                        ),
                      ),
                      Expanded(
                          child: IconButton(
                        onPressed: takePicture1,
                        iconSize: 90,
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        icon: const Icon(Icons.circle, color: Colors.white),
                      )),
                      IconButton(
                        onPressed: () {
                          setState(() {
                            _currentFlashMode == FlashMode.torch
                                ? _currentFlashMode = FlashMode.off
                                : _currentFlashMode = FlashMode.torch;
                          });
                          controller!.setFlashMode(
                            _currentFlashMode,
                          );
                        },
                        icon: Icon(
                          Icons.highlight,
                          size: 35,
                          color: _currentFlashMode == FlashMode.torch
                              ? Colors.amber
                              : Colors.white,
                        ),
                      ),
                      //const Spacer(),
                    ]),
              ),
            )),
      ]),
    ));
  }
}