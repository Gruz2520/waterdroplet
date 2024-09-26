import 'package:dio/dio.dart';
import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class URLS {
  static const String API_URL = 'https://api.waterdroplet.ru';
  static const String BASE_URL = 'https://waterdroplet.ru';
}

class ApiService {
  final dio = Dio();
  final storage = new FlutterSecureStorage();

  Future<List> scanValidationPhoto(path) async {
    try {
      FormData formData = FormData.fromMap({
        "photo": await MultipartFile.fromFile("$path"),
        "key": 'thisissupersecret',
      });
      var response =
          await dio.post("${URLS.BASE_URL}/scan_validation_photo", data: formData);
      await storage.write(key: "QR_INFO", value: (response.data['qr_string']).toString());
      return [response.statusCode, response.data['number']];
    } on DioException catch (e) {
      return [e.response?.statusCode];
    }
  }

  Future<List> login(username, password) async{
    try{
      var response = await dio.post("${URLS.BASE_URL}/login", data: jsonEncode({'username': username, 'password': password}));
      return [response.statusCode ,response.data['access_token'], response.data['first_enter']];
    }on DioException catch (e) {
      return [e.response?.statusCode];
    }
  }

  Future<List> userInfo(String token) async{
    try{
      var response = await dio.post("${URLS.BASE_URL}/user_info", data: jsonEncode({'access_token': token}));
      List<String> fio = response.data['full_name'].toString().split(' ');
      if (fio.length >= 2){
        return [response.statusCode, fio[1]];
      }
      else{
        return [response.statusCode, response.data['full_name']];
      }
      
    }on DioException catch (e) {
      return [e.response?.statusCode];
    }
  }
  Future<List> newVal(String token, String number) async{
    try{
      String? qr_string = await storage.read(key: 'QR_INFO');
      var response = await dio.post("${URLS.BASE_URL}/new_validation", queryParameters: {'sotr_number': number, 'qr_string': qr_string}, data: jsonEncode({'access_token': token}));
      return [response.statusCode];
    }on DioException catch (e) {
      return [e.response?.statusCode];
    }
    }
}
