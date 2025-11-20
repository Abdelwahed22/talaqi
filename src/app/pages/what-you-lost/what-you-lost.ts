import { Component } from '@angular/core';

@Component({
  selector: 'app-what-you-lost',
  imports: [],
  templateUrl: './what-you-lost.html',
  styleUrl: './what-you-lost.css',
})
export class WhatYouLost {

   
  // بيانات الكروت الثلاثة
  categories = [
    { id: 1, title: 'أشخاص', icon: 'fa-solid fa-user', color: '#769FCD' },
    { id: 2, title: 'أغراض', icon: 'fa-solid fa-mobile-screen-button', color: '#769FCD' },
    { id: 3, title: 'حيوانات أليفة', icon: 'fa-solid fa-paw', color: '#769FCD' }
  ];

  // بيانات القائمة الجانبية (المفقود مؤخراً)
  recentItems = [
    { title: 'محفظة مفقودة', desc: 'محفظة جلدية سوداء مفقودة بالقرب من حديقة السنترال في 10 أكتوبر.' },
    { title: 'كلب مفقود', desc: 'جولدن ريتريفر اسمه ماكس، آخر مرة رؤيته في وسط المدينة.' },
     { title: 'محفظة مفقودة', desc: 'محفظة جلدية سوداء مفقودة بالقرب من حديقة السنترال في 10 أكتوبر.' },
    { title: 'كلب مفقود', desc: 'جولدن ريتريفر اسمه ماكس، آخر مرة رؤيته في وسط المدينة.' },
    { title: 'مفاتيح مفقودة', desc: 'مفاتيح المنزل مع ميدالية زرقاء، سقطت في المول.' },
     { title: 'محفظة مفقودة', desc: 'محفظة جلدية سوداء مفقودة بالقرب من حديقة السنترال في 10 أكتوبر.' },
    { title: 'كلب مفقود', desc: 'جولدن ريتريفر اسمه ماكس، آخر مرة رؤيته في وسط المدينة.' },
    { title: 'مفاتيح مفقودة', desc: 'مفاتيح المنزل مع ميدالية زرقاء، سقطت في المول.' },
    { title: 'مفاتيح مفقودة', desc: 'مفاتيح المنزل مع ميدالية زرقاء، سقطت في المول.' }
  ];

}
