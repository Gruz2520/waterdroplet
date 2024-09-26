import 'package:flutter/material.dart';
import 'package:waterdroplet_s/components/button_for_login.dart';
import 'package:waterdroplet_s/components/textfield_for_login.dart';
import 'package:waterdroplet_s/components/check_box_remember_me.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:waterdroplet_s/moduls/api.dart';
import 'package:dio/io.dart';

class LoginPage extends StatefulWidget {
  LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  var api = ApiService();
  // text editing controllers
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  final storage = const FlutterSecureStorage();
  bool rememberMe = false;
  dynamic token;
  bool first = false;

  // sign user in method
  Future<void> signUserIn(String login, String pass) async {
    List res = await api.login(login, pass);
    if (res[0] == 200) {
      await storage.write(key: "TOKEN", value: res[1].toString());
      await storage.write(key: 'KEY_LOGIN', value: usernameController.text);
      if (rememberMe) {
        await storage.write(key: 'KEY_PASS', value: passwordController.text);
      }
      Navigator.pushNamed(context, '/camera');
    } else {
      showError(context);
      passwordController.clear();
    }
  }

  void showError(context) {
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            backgroundColor: Colors.white,
            title: const Text("Ошибка", style: TextStyle(color: Color(0xff2b59d3)),),
            content: const Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(
                  child: Text(
                    "Не правильный логин или пароль. Попробуйте еще раз.",
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
  Future<void> init() async {
    if (await storage.read(key: 'KEY_LOGIN') != null &&
        await storage.read(key: 'KEY_PASS') != null) {
      usernameController.text = (await storage.read(key: 'KEY_LOGIN'))!;
      passwordController.text = (await storage.read(key: 'KEY_PASS'))!;
      signUserIn(usernameController.text, passwordController.text);
    }
  }

  @override
  Widget build(BuildContext context) {
    init();
    return SafeArea(
        child: Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            mainAxisSize: MainAxisSize.max,
            children: [
              Align(
                alignment: Alignment.topCenter,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(height: (MediaQuery.of(context).size.height)*0.1),
              
                    // logo
                    Image.asset("assets/logo_with_text.png", width: (MediaQuery.of(context).size.width)*0.7, height: (MediaQuery.of(context).size.width)*0.7,),
              
                    //const SizedBox(height: 62),
                  ],
                ),
              ),
        
              Align(
                alignment: Alignment.bottomCenter,
                child:Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  mainAxisSize: MainAxisSize.min,
                children: [
                  MyTextField(
                    controller: usernameController,
                    hintText: 'логин',
                    obscureText: false,
                  ),
        
                  const SizedBox(height: 10),
        
                  // password textfield
                  MyTextField(
                    controller: passwordController,
                    hintText: 'пароль',
                    obscureText: true,
                  ),
                  const SizedBox(height: 10),
                  // sign in button
                  MyButton(
                      text: "Авторизация",
                      onTap: () {
                        signUserIn(
                            usernameController.text, passwordController.text);
                      }),
        
                  Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      child: LabeledCheckbox(
                          label: "Запомнить меня",
                          padding: EdgeInsets.zero,
                          value: rememberMe,
                          onChanged: (bool val) {
                            setState(() {
                              rememberMe = val;
                            });
                          })),
                ],
              ),)
            ],
          ),
        ),
      ),
    ));
  }
}
