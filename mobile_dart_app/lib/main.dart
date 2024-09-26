import 'package:flutter/material.dart';
import 'package:waterdroplet_s/pages/auth.dart';
import 'package:waterdroplet_s/pages/camera.dart';
import 'package:camera/camera.dart';

List<CameraDescription> cameras = [];
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  cameras = await availableCameras();
  runApp(MaterialApp(
    theme: ThemeData(primarySwatch: Colors.lightBlue),
    initialRoute: '/auth',
    routes: {
      '/auth': (context) => LoginPage(),
      '/camera': (context) => CameraPage()
    },
  ));
}
