import { Component } from '@angular/core';

@Component({
  selector: 'app-what-you-found',
  standalone: true,
  imports: [],
  templateUrl: './what-you-found.html',
  styleUrl: './what-you-found.css',
})
export class WhatYouFound {



  // بيانات الكروت الثلاثة
  categories = [
    { id: 1, title: 'أشخاص', subTitle: 'أضف صورة مناسبة', icon: 'fa-solid fa-user' },
    { id: 2, title: 'أغراض', subTitle: 'أضف صورة مناسبة', icon: 'fa-solid fa-box-open' }, // غيرت الأيقونة لتكون أقرب للأغراض
    { id: 3, title: 'حيوانات أليفة', subTitle: 'أضف صورة مناسبة', icon: 'fa-solid fa-paw' }
  ];

  // بيانات القائمة الجانبية (الموجود مؤخراً)
  foundItems = [
    { title: 'محفظة موجودة', desc: 'محفظة جلدية ضخمة سوداء تم العثور عليها بالقرب من حديقة السنترال في 10 أكتوبر.' },
    { title: 'كلب موجود', desc: 'كلب جولدن ريتريفر يبدو ودوداً تم العثور عليه في وسط المدينة.' },
    { title: 'مفاتيح موجودة', desc: 'مفاتيح المنزل مع ميدالية زرقاء، تم التقاطها في المول.' },
    { title: 'هاتف موجود', desc: 'هاتف آيفون 14 في غطاء أسود، تم العثور عليه أثناء التنقل المسائي.' }
  ];
}