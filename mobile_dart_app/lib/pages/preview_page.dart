import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:waterdroplet_s/moduls/api.dart';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';


class PreviewPage extends StatefulWidget {
  const PreviewPage({Key? key, required this.picture}) : super(key: key);
  final XFile picture;

  @override
  State<PreviewPage> createState() => _PreviewPageState();
}

class _PreviewPageState extends State<PreviewPage> {
  late Future<String> number;
  var api = ApiService();
  final storage = new FlutterSecureStorage();
  late Future<int> savedNumber;

  Future<int> newVal(String newNumber) async{
    String? token = await storage.read(key: 'TOKEN');
    if (token != null){
      List res = await api.newVal(token.toString(), newNumber);
      return res[0];
    }
    else{
      return 400;
    }
  }

  Future<String> scanValidationPhoto() async{
    List res = await api.scanValidationPhoto(widget.picture.path);
    if (res[0] == 200){
      return res[1].toString();
    }else if (res[0] == 403) {
      return "Ошибка приложения";
    } else if (res[0] == 404) {
      return "Ошибка QR кода";
    } else if (res[0] == 417) {
      return "Ошибка счетчика";
    } else if (res[0] >= 500) {
      return "Ошибка сервера";
    }else {
      return "Ошибка";
    }
  }

  void checkSaveNumber(context){
    showDialog(context: context, builder: (context){
      return StatefulBuilder( builder: (context, setState){
        return AlertDialog(
          title: const Text("Подтверждение проверки"),
          titleTextStyle: 
            const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.black,fontSize: 20),
          content: FutureBuilder(future: savedNumber, builder: (context, snapshot){
            if (snapshot.hasData){
              if (snapshot.data == 200){
                return const Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("Проверка сохранена")
              ],
            );
              }
              else{
                return const Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("Ошибка сохранения проверки. Повторите попытку."),
              ],
            );
              }
            }
            else{
            return const Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 100,
                        height: 100,
                              child: CircularProgressIndicator(),
                            ),
                    ],
                  ),
                ),
              ],
            );}
          }),
          actions: [
            FutureBuilder(future: savedNumber, builder: (context, snapshot){
              if (snapshot.hasData){
                if(snapshot.data == 200){
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
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
                              Navigator.pushNamed(context, '/camera');
                              },
                              child: const Text(
                                "Ok",
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
                  );
                }
                else{
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
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
                              Navigator.pushNamed(context, '/camera');
                              },
                              child: const Text(
                                "Повторить",
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
                  );
                }
              }
              else{
                return Row();
              }
            })
          ],
        );
      });});
  }

  @override
  void initState() {
    super.initState();
  }

  Future<void> confirmData(context) async {
    Map<String, String> errors = {
      'Ошибка QR кода': '''Возникла проблема с QR кодом, который находится на лицевой стороне счетчика. Попробуйте протереть его от пыли и повторить фотографию. В случае его физического повреждения оставьте обращение в поддержку.''',
      "Ошибка приложения": "Возникла проблема с приложением. Попробуйте перезайти в него или же оставьте обращение в поддержку.",
      "Ошибка счетчика": "Возникла проблема с распознованием показаний счетчика. Попробуйте протереть его от пыли и повторить фотографию. В случае его физического повреждения оставьте обращение в поддержку.",
      "Ошибка сервера": "Возникла неожиданная ошибка сервера. Мы уже работаем над ее устранением. Пожалуйста повторите попытку чуть позже.",
      "Ошибка": "Возникла неизвестная ошибка. Повторите попытку позже или оставьте обращение в поддержку."
    };
    var padding = MediaQuery.of(context).padding;
    double? w = (MediaQuery.of(context).size.width -
                    padding.left -
                    padding.right) * 0.08;
    double? h = w*1.5;
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            contentPadding: const EdgeInsets.fromLTRB(15, 15, 15, 0),
            backgroundColor: Colors.white,
            title: const Text(
                        'Показания ИПУ',
                        style: TextStyle(color: Color(0xff2b59d3)),
                      ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(
                  child: FutureBuilder(future: Future.wait([number]), builder: (context, AsyncSnapshot<List<dynamic>> snapshot) {
                    if (snapshot.hasData){
                      if (snapshot.data.toString()[1] != 'О'){
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[0], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),)),
                            ),
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[1], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20))),
                            ),
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[2], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20))),
                            ),
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[3], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20))),
                            ),
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[4], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20))),
                            ),
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: const Color(0xffed063c),
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[5], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20))),
                            ),
                            Container(
                              height: h,
                              width: w,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(
                                  color: const Color(0xffed063c),
                                  width: 2 
                                ),
                                borderRadius: BorderRadius.circular(10)
                              ),
                              child: Center(child: Text(snapshot.data![0].toString()[6], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20))),
                            ),
                          ],
                        ),
                        ), 
                        SizedBox(
                          height: 20,
                          child: TextButton(
                                onPressed: () {
                                    Navigator.pushNamed(
                                          context, '/camera');
                                }, 
                                style: TextButton.styleFrom(
                                  padding: EdgeInsets.zero,
                                  minimumSize: Size.zero
                                ),
                                child: const Text(
                                  "повторить",
                                  style: TextStyle(color: Colors.grey),)),
                        ),
                        
                        ],
                      );
                    }
                    else {
                      var error = errors[snapshot.data![0].toString()];
                      return Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(15, 0, 15, 10),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children:[Text(
                              snapshot.data![0].toString(),
                              style: const TextStyle(color: Color(0xffed063c), fontWeight: FontWeight.bold),
                            ),
                            Text(error!),
                        // add support for sotrudniki
                        //     SizedBox(
                        //   height: 20,
                        //   child: TextButton(
                        //         onPressed: () {
                        //           Navigator.pop(context);
                        //           support(context, nameController, telephoneController, messageController);
                        //         }, 
                        //         style: TextButton.styleFrom(
                        //           padding: EdgeInsets.zero,
                        //           minimumSize: Size.zero
                        //         ),
                        //         child: const Text(
                        //           "Обращение в поддержку",
                        //           style: TextStyle(color: Colors.grey))),
                        // ),
                          ],
                        ),
                      ),
                    ],
                  );
                    }}
                    else{
                      return const SizedBox(height: 100, width: 100, child: CircularProgressIndicator(color: Color(0xff2b59d3),),);
                      }
                  },)
                ),
              ],
            ),
            actionsAlignment: MainAxisAlignment.center,
            actions: [
              FutureBuilder(future: Future.wait([number]), builder: (context, AsyncSnapshot<List<dynamic>> snapshot) {
                  if (snapshot.hasData){
                    if (snapshot.data.toString()[1] != 'О'){
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
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
                                // confirmed a number
                                savedNumber = newVal(snapshot.data![0].toString());
                                Navigator.pop(context);
                                checkSaveNumber(context);
                              },
                              child: const Text(
                                "Подтвердить",
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
                  );}
                  else{
                    return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
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
                                Navigator.pushNamed(
                                      context, '/camera');
                              },
                              child: const Text(
                                "Повторить",
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
                  );
                  }}
                  else{
                    return Row();
                  }
                  })
            ],
          );
        });
  }



@override
Widget build(BuildContext context) {
  var padding = MediaQuery.of(context).padding;

  return Scaffold(
    body: SafeArea(
      child: Center(
        child: Stack(children: [
          Image.file(File(widget.picture.path),
              width: MediaQuery.of(context).size.width -
                  padding.left -
                  padding.right,
              fit: BoxFit.cover,
              height: (MediaQuery.of(context).size.height -
                      padding.bottom -
                      padding.top) *
                  0.9,
              alignment: Alignment.center),
          Align(
            alignment: Alignment.topLeft,
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: IconButton(
                icon: const Icon(
                  Icons.arrow_back_outlined,
                  size: 40,
                  color: Colors.white,
                ),
                onPressed: () async {
                  Navigator.pushReplacementNamed(context, '/camera');
                },
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: SizedBox(
              height: (MediaQuery.of(context).size.height -
                      padding.bottom -
                      padding.top) *
                  0.12,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xff2b59d3),
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.vertical(top: Radius.circular(18))
                  )
                ),
                child: const Center(
                  child: Text(
                    "Отправить",
                    style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ),
                  onPressed: () async {
                    number = scanValidationPhoto();
                    confirmData(context);
                  },
                ),
              ),
            )
          ]),
        ),
      ),
    );
  }
}
