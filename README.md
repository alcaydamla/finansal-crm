# 💼 Finansal CRM

Finansal CRM, müşteri ve işlem (transaction) yönetimini kolaylaştırmak amacıyla geliştirilen tam yığınlı bir web uygulamasıdır. Uygulama, banka veya finans kuruluşlarının müşterilere ait borç/ödeme işlemlerini ve müşteri detaylarını yönetmesini sağlar.

## Özellikler

- Müşteri ekleme, listeleme ve silme
- Borç ve ödeme işlemi ekleme, filtreleme
- Tutar, tarih ve işlem türüne göre sıralama ve filtreleme
- Form doğrulama (validation) kontrolleri
- Excel’e aktarma özelliği
- Kullanıcı dostu ve sade arayüz

## Teknolojiler

### Frontend
- [React.js](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design (AntD)](https://ant.design/)
- Axios, FileSaver, XLSX

### Backend
- .NET Web API (C#)
- Katmanlı mimari: DTO, Entity, Operation, Controller
- Stored Procedure destekli Oracle bağlantısı

### Database
- [Oracle 19c](https://www.oracle.com/database/technologies/)
- SQL + PL/SQL
- Stored Procedures ve View kullanımı

📸 Uygulama Ekran Görüntüleri
- Ana Sayfa
- Müşteri Listesi
- İşlem Listesi
- İşlem Güncelleme Sayfası
- Müşteri Detay Sayfası


## Kurulum

```bash
# frontend
cd Frontend
npm install
npm run dev

# backend
# Visual Studio code ile aç → Wall projesini çalıştır (Ctrl+F5)
