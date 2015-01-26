#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QFile>
#include <QTextStream>
#include <QDesktopServices>
#include <QUrl>
#include <QDebug>

QString PLACE_HOLDER = "#$@#";

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{
    writeCodeFile();
    replaceHTMLText();
    QDesktopServices::openUrl(QUrl("index.html"));
}


void MainWindow::writeCodeFile()
{
    QFile codeFile("code.js");
    codeFile.open(QIODevice::WriteOnly | QIODevice::Text);

    QTextStream data(&codeFile);
    data << "var code = " + ui->tb_source->toPlainText();
    codeFile.close();
}

void MainWindow::replaceHTMLText()
{
    QFile htmlFile("sourcehtml.html");
    htmlFile.open(QIODevice::ReadOnly | QIODevice::Text);

    QTextStream data(&htmlFile);
    QString datastr = data.readAll();
    qDebug() << datastr;
    datastr = datastr.replace(PLACE_HOLDER , ui->tb_source->toPlainText());
    htmlFile.close();

    QFile outputHtml("index.html");
    outputHtml.open(QIODevice::WriteOnly | QIODevice::Text);

    qDebug() << datastr;

    QTextStream dataWrite(&outputHtml);
    dataWrite << datastr;
    outputHtml.close();
}
