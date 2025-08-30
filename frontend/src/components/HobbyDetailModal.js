import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  AccessTime,
  MonetizationOn,
  TrendingUp,
  Stars,
  CheckCircle,
  Phone,
  Language,
  PlayArrow,
  Info
} from '@mui/icons-material';

const HobbyDetailModal = ({ open, onClose, hobby }) => {
  const [loading, setLoading] = useState(false);
  const [detailedInfo, setDetailedInfo] = useState(null);

  useEffect(() => {
    if (open && hobby) {
      fetchDetailedInfo();
    }
  }, [open, hobby]);

  const fetchDetailedInfo = async () => {
    setLoading(true);
    try {
      // استدعاء API للحصول على التفاصيل المطولة
      const response = await fetch(`/api/hobbies/${hobby.id}`);
      if (response.ok) {
        const data = await response.json();
        setDetailedInfo(data);
      }
    } catch (error) {
      console.error('Error fetching detailed info:', error);
    }
    setLoading(false);
  };

  const getCostColor = (costLevel) => {
    switch (costLevel) {
      case 'Free': return 'success';
      case 'Low': return 'info';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  const getSkillColor = (skillLevel) => {
    switch (skillLevel) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  // بيانات تفصيلية مخصصة لكل هواية على حدة
  const getHobbyDetails = (hobby) => {
    const hobbyName = hobby?.name || '';
    
    // تفاصيل مخصصة حسب اسم الهواية بالضبط
    if (hobbyName.includes('حفظ آية') || hobbyName.includes('حفظ القرآن')) {
      return {
        benefits: [
          'تطوير الروحانية والاتصال مع الله',
          'تحسين الذاكرة والتركيز',
          'زيادة السكينة والطمأنينة',
          'تطوير الانضباط والالتزام',
          'فهم أعمق لتعاليم الدين'
        ],
        requirements: ['القرآن الكريم', 'مكان هادئ', 'وقت ثابت يومياً'],
        apps: [
          { name: 'تطبيق القرآن الكريم', description: 'مصحف رقمي مع التلاوة والتفسير' },
          { name: 'حفظ القرآن', description: 'تطبيق مخصص لمساعدة الحفظ والمراجعة' },
          { name: 'آيات', description: 'تذكيرات يومية وبرنامج حفظ تدريجي' },
          { name: 'أذكاري', description: 'تطبيق للأذكار اليومية والدعاء' }
        ],
        websites: [
          { name: 'موقع القرآن الكريم', url: 'quran.com', description: 'مصحف شامل مع التفاسير' },
          { name: 'تدبر', url: 'tadabbur.com', description: 'منصة لتدبر وفهم القرآن' },
          { name: 'إسلام ويب', url: 'islamweb.net', description: 'موقع شامل للعلوم الإسلامية' }
        ],
        tips: [
          'ابدأ بآية واحدة واتقنها قبل الانتقال للتالية',
          'اختر وقت صافي الذهن مثل بعد الفجر',
          'استمع للآية عدة مرات قبل الحفظ',
          'راجع ما حفظته يومياً',
          'ادع الله أن يعينك على الحفظ والفهم'
        ]
      };
    } else if (hobbyName.includes('طي الورق') || hobbyName.includes('أوريغامي')) {
      return {
        benefits: [
          'تحسين التركيز والدقة في التفاصيل',
          'تطوير مهارات حل المشاكل المكانية',
          'الاسترخاء وتقليل التوتر',
          'تحسين مهارات الرياضيات الهندسية',
          'إنتاج قطع فنية جميلة كهدايا'
        ],
        requirements: ['ورق ملون أو عادي', 'مقص صغير (اختياري)', 'مسطرة', 'دليل أو فيديو'],
        apps: [
          { name: 'Origami Instructions', description: 'دليل خطوة بخطوة لطي الورق' },
          { name: 'How to Make Origami', description: 'تطبيق مع رسوم متحركة للطي' },
          { name: 'Origami Paper', description: 'أنماط ورق رقمية للطباعة' },
          { name: 'Paper Folding 3D', description: 'تطبيق ثلاثي الأبعاد لتعلم الأوريغامي' }
        ],
        websites: [
          { name: 'Origami Way', url: 'origami-way.com', description: 'دروس مجانية للمبتدئين' },
          { name: 'Origami Club', url: 'en.origami-club.com', description: 'مجتمع محبي الأوريغامي' },
          { name: 'يوتيوب قناة الأوريغامي', url: 'youtube.com', description: 'قنوات متخصصة في طي الورق' }
        ],
        tips: [
          'ابدأ بالأشكال البسيطة مثل الطائر والوردة',
          'استخدم ورق مربع الشكل',
          'اتبع التعليمات خطوة بخطوة ببطء',
          'تدرب على نفس الشكل عدة مرات',
          'شارك إبداعاتك مع الأصدقاء'
        ]
      };
    } else if (hobbyName.includes('قصيدة') || hobbyName.includes('شعر')) {
      return {
        benefits: [
          'التعبير عن المشاعر والأفكار بطريقة جميلة',
          'تطوير المهارات اللغوية والبلاغية',
          'تحسين الذاكرة والإبداع',
          'العلاج النفسي من خلال الكتابة',
          'بناء الثقة في التعبير عن الذات'
        ],
        requirements: ['دفتر أو ورق', 'قلم', 'مكان هادئ للإلهام', 'قاموس (اختياري)'],
        apps: [
          { name: 'الشاعر', description: 'تطبيق لكتابة وتنظيم القصائد' },
          { name: 'بحور الشعر', description: 'تعلم أوزان وبحور الشعر العربي' },
          { name: 'قاموس المعاني', description: 'للبحث عن المرادفات والمعاني' },
          { name: 'ديوان شعري', description: 'لحفظ وتنظيم قصائدك الشخصية' }
        ],
        websites: [
          { name: 'أدب', url: 'adab.com', description: 'منصة للأدب والشعر العربي' },
          { name: 'الديوان', url: 'aldiwan.net', description: 'مكتبة شعرية شاملة' },
          { name: 'شعراء العرب', url: 'poets.org', description: 'أكبر موقع للشعر العربي' }
        ],
        tips: [
          'ابدأ بكتابة مشاعرك بصدق',
          'اقرأ شعر الآخرين للإلهام',
          'لا تقلق من الوزن في البداية',
          'اكتب عن تجاربك الشخصية',
          'راجع وحسن قصائدك'
        ]
      };
    } else if (hobbyName.includes('رسم رقمي') || hobbyName.includes('رسم بالجوال')) {
      return {
        benefits: [
          'تطوير مهارات تقنية قيمة في سوق العمل',
          'التعبير الإبداعي بأدوات حديثة',
          'إنشاء محتوى رقمي جذاب',
          'تحسين التركيز والصبر',
          'بناء portfolio فني مميز'
        ],
        requirements: ['جوال أو تابلت', 'تطبيق رسم', 'قلم رقمي (اختياري)'],
        apps: [
          { name: 'Procreate', description: 'أفضل تطبيق رسم رقمي للـ iPad (مدفوع)' },
          { name: 'Adobe Fresco', description: 'تطبيق مجاني بأدوات احترافية' },
          { name: 'Autodesk Sketchbook', description: 'تطبيق مجاني بواجهة بسيطة للمبتدئين' },
          { name: 'Concepts', description: 'للرسم الهندسي والتصميم المتقدم' }
        ],
        websites: [
          { name: 'YouTube Art Tutorials', url: 'youtube.com', description: 'دروس مجانية للرسم الرقمي' },
          { name: 'Pinterest Art Ideas', url: 'pinterest.com', description: 'مرجع لأفكار وإلهام فني' },
          { name: 'DeviantArt', url: 'deviantart.com', description: 'مجتمع الفنانين والمشاركة' }
        ],
        tips: [
          'ابدأ بالأشكال البسيطة قبل التعقيد',
          'تعلم استخدام الطبقات (Layers)',
          'جرب فرش مختلفة لتأثيرات متنوعة',
          'احفظ عملك بشكل متكرر',
          'شارك أعمالك للحصول على تقييم'
        ]
      };
    } else if (hobbyName.includes('زراعة البذور') || hobbyName.includes('زراعة')) {
      return {
        benefits: [
          'الاتصال مع الطبيعة وتقليل التوتر',
          'تعلم الصبر ومراقبة النمو',
          'تحسين جودة الهواء في المنزل',
          'تطوير المسؤولية والاهتمام',
          'إنتاج طعام طبيعي وصحي'
        ],
        requirements: ['بذور', 'كوب أو إناء', 'ماء نظيف', 'تربة (اختياري)', 'مكان بإضاءة جيدة'],
        apps: [
          { name: 'PlantNet', description: 'تحديد أنواع النباتات بالصور' },
          { name: 'Garden Timeline', description: 'تتبع نمو النباتات وجدولة الري' },
          { name: 'Moon & Garden', description: 'أفضل أوقات الزراعة حسب القمر' },
          { name: 'PlantIn', description: 'تطبيق شامل لرعاية النباتات' }
        ],
        websites: [
          { name: 'Garden.org', url: 'garden.org', description: 'دليل شامل للزراعة المنزلية' },
          { name: 'موقع زراعة', url: 'zira3a.net', description: 'معلومات عن الزراعة باللغة العربية' },
          { name: 'الزراعة المنزلية', url: 'homegarden.com', description: 'نصائح للزراعة في البيت' }
        ],
        tips: [
          'ابدأ بالنباتات السهلة مثل النعناع والبقدونس',
          'تأكد من وجود فتحات تصريف في الإناء',
          'اسق النبات عند جفاف التربة السطحية',
          'ضع النبات قرب النافذة للضوء الطبيعي',
          'سجل تقدم النمو بالصور يومياً'
        ]
      };
    } else if (hobbyName.includes('تصوير') || hobbyName.includes('صور')) {
      return {
        benefits: [
          'توثيق اللحظات الجميلة والذكريات',
          'تطوير مهارات الملاحظة والتركيز',
          'التعبير الفني عن وجهة النظر',
          'تحسين مهارات التكنولوجيا',
          'إمكانية العمل المستقل في التصوير'
        ],
        requirements: ['كاميرا جوال أو كاميرا رقمية', 'عين فنية', 'صبر وممارسة'],
        apps: [
          { name: 'VSCO', description: 'تحرير احترافي للصور مع فلاتر جميلة' },
          { name: 'Lightroom Mobile', description: 'تطبيق Adobe المجاني للتحرير' },
          { name: 'Snapseed', description: 'تطبيق مجاني من Google للتحرير' },
          { name: 'Camera+ 2', description: 'تطبيق كاميرا متقدم مع إعدادات يدوية' }
        ],
        websites: [
          { name: 'Photography Blog', url: 'photographyblog.com', description: 'نصائح ودروس تصوير' },
          { name: '500px', url: '500px.com', description: 'مجتمع المصورين وعرض الأعمال' },
          { name: 'Flickr', url: 'flickr.com', description: 'منصة لمشاركة الصور' }
        ],
        tips: [
          'اهتم بالإضاءة الطبيعية',
          'اتبع قاعدة الأثلاث في التكوين',
          'صور من زوايا مختلفة',
          'ركز على التفاصيل الصغيرة',
          'تدرب يومياً على التصوير'
        ]
      };
    } else if (hobbyName.includes('طبخ') || hobbyName.includes('طعام')) {
      return {
        benefits: [
          'توفير المال وتحسين الصحة',
          'تطوير الإبداع في المطبخ',
          'تعلم مهارة حياتية مهمة',
          'قضاء وقت ممتع مع العائلة',
          'اكتشاف نكهات وثقافات جديدة'
        ],
        requirements: ['3 مكونات بسيطة', 'أدوات مطبخ أساسية', 'موقد', 'إبداع وتجريب'],
        apps: [
          { name: 'Yummly', description: 'وصفات مخصصة حسب المكونات المتاحة' },
          { name: 'Tasty', description: 'فيديوهات قصيرة لوصفات سهلة' },
          { name: 'Kitchen Stories', description: 'وصفات مع تعليمات خطوة بخطوة' },
          { name: 'شهية', description: 'وصفات عربية وشرق أوسطية' }
        ],
        websites: [
          { name: 'فتافيت', url: 'fatafeat.com', description: 'وصفات عربية متنوعة' },
          { name: 'All Recipes', url: 'allrecipes.com', description: 'أكبر موقع وصفات عالمي' },
          { name: 'طبخ عربي', url: 'tabkh.com', description: 'وصفات تراثية وحديثة' }
        ],
        tips: [
          'ابدأ بوصفات بسيطة من 3 مكونات',
          'اقرأ الوصفة كاملة قبل البدء',
          'حضر جميع المكونات مقدماً',
          'تذوق الطعام أثناء الطبخ',
          'لا تخف من التجريب والتعديل'
        ]
      };
    } else if (hobbyName.includes('قراءة') || hobbyName.includes('كتاب')) {
      return {
        benefits: [
          'توسيع المعرفة وتطوير الثقافة العامة',
          'تحسين التركيز ومهارات التحليل',
          'تطوير مهارات التفكير النقدي',
          'زيادة المفردات وتحسين اللغة',
          'الهروب الإيجابي من ضغوط الحياة'
        ],
        requirements: ['كتاب ورقي أو إلكتروني', 'مكان هادئ ومريح', 'إضاءة جيدة', 'دفتر ملاحظات'],
        apps: [
          { name: 'Kindle', description: 'مكتبة رقمية ضخمة للكتب الإلكترونية' },
          { name: 'Audible', description: 'كتب صوتية للاستماع أثناء التنقل' },
          { name: 'Goodreads', description: 'تتبع قراءاتك واكتشاف كتب جديدة' },
          { name: 'أبجد', description: 'منصة عربية لمحبي القراءة' }
        ],
        websites: [
          { name: 'مكتبة نور', url: 'noor-book.com', description: 'مكتبة عربية مجانية شاملة' },
          { name: 'Project Gutenberg', url: 'gutenberg.org', description: 'كتب كلاسيكية مجانية' },
          { name: 'هنداوي', url: 'hindawi.org', description: 'كتب عربية مجانية عالية الجودة' }
        ],
        tips: [
          'حدد هدف قراءة يومي واقعي (10-20 صفحة)',
          'اختر مواضيع تهمك شخصياً في البداية',
          'خذ ملاحظات أو اقتباسات مهمة',
          'ناقش ما قرأته مع الآخرين',
          'نوع بين الأنواع الأدبية المختلفة'
        ]
      };
    } else if (hobbyName.includes('رسم') && !hobbyName.includes('رقمي')) {
      return {
        benefits: [
          'تطوير المهارات الحركية الدقيقة',
          'تحسين التركيز والملاحظة',
          'التعبير الفني عن المشاعر',
          'الاسترخاء وتقليل التوتر',
          'بناء الثقة بالنفس والإبداع'
        ],
        requirements: ['ورق رسم', 'أقلام رصاص', 'ممحاة', 'أقلام ملونة (اختياري)'],
        apps: [
          { name: 'How to Draw', description: 'دروس تعليمية خطوة بخطوة للرسم' },
          { name: 'Drawing Ideas', description: 'أفكار ومراجع للرسم' },
          { name: 'SketchBook', description: 'دفتر رسم رقمي للتمرين' },
          { name: 'يوتيوب', description: 'قنوات تعليم الرسم المجانية' }
        ],
        websites: [
          { name: 'DrawSpace', url: 'drawspace.com', description: 'دروس رسم مجانية للمبتدئين' },
          { name: 'Proko', url: 'proko.com', description: 'دروس رسم احترافية' },
          { name: 'تعلم الرسم', url: 'learn-to-draw.com', description: 'موقع عربي لتعليم الرسم' }
        ],
        tips: [
          'ابدأ بالأشكال الهندسية البسيطة',
          'تدرب على رسم الخطوط المستقيمة والمنحنيات',
          'ارسم ما تراه حولك يومياً',
          'لا تمحو كل خطأ - تعلم منه',
          'احتفظ بجميع رسوماتك لترى التطور'
        ]
      };
    } else if (hobbyName.includes('موسيقى') || hobbyName.includes('نوتات')) {
      return {
        benefits: [
          'تطوير السمع الموسيقي والذوق الفني',
          'تحسين التناسق والتركيز',
          'التعبير عن المشاعر بلغة عالمية',
          'تقوية الذاكرة والانضباط',
          'فرصة للعب مع آخرين اجتماعياً'
        ],
        requirements: ['آلة موسيقية أو تطبيق', 'صبر وممارسة منتظمة', 'مكان هادئ'],
        apps: [
          { name: 'Simply Piano', description: 'تعلم البيانو بطريقة تفاعلية ممتعة' },
          { name: 'Yousician', description: 'تعلم آلات متعددة: بيانو، جيتار، كمان' },
          { name: 'Piano Academy', description: 'دروس بيانو من المبتدئ للمتقدم' },
          { name: 'Perfect Piano', description: 'بيانو افتراضي للتمرين' }
        ],
        websites: [
          { name: 'Music Theory', url: 'musictheory.net', description: 'تعلم نظريات الموسيقى' },
          { name: 'Piano Nanny', url: 'pianonanny.com', description: 'دروس بيانو للأطفال والكبار' },
          { name: 'موسيقار', url: 'musicar.net', description: 'موقع عربي لتعليم الموسيقى' }
        ],
        tips: [
          'ابدأ بتعلم 5 نوتات أساسية فقط',
          'تدرب 10-15 دقيقة يومياً بانتظام',
          'استمع للموسيقى التي تريد تعلمها',
          'لا تستعجل - الموسيقى تحتاج صبر',
          'سجل نفسك وأنت تعزف لتتبع التقدم'
        ]
      };
    } else if (hobbyName.includes('رسالة للذات') || hobbyName.includes('رسالة لنفسك')) {
      return {
        benefits: [
          'تطوير الوعي الذاتي والتأمل',
          'تحديد الأهداف والأحلام بوضوح',
          'تحفيز الذات للتطوير المستمر',
          'توثيق اللحظة الحالية للمستقبل',
          'تعزيز الثقة بالنفس والطموح'
        ],
        requirements: ['ورق أو دفتر', 'قلم', 'مكان هادئ للتأمل', 'صدق مع النفس'],
        apps: [
          { name: 'Journey', description: 'تطبيق يوميات رقمي جميل ومنظم' },
          { name: 'Day One', description: 'تطبيق كتابة يوميات مع صور' },
          { name: 'Future Me', description: 'إرسال رسائل لنفسك في المستقبل' },
          { name: 'Time Capsule', description: 'كبسولة زمنية رقمية للذكريات' }
        ],
        websites: [
          { name: 'FutureMe', url: 'futureme.org', description: 'إرسال رسائل إلكترونية للمستقبل' },
          { name: 'Letter to Future Self', url: 'letterfuture.com', description: 'منصة لكتابة رسائل المستقبل' }
        ],
        tips: [
          'اكتب عن أحلامك وأهدافك الحالية',
          'شارك مشاعرك الصادقة في هذه اللحظة',
          'اسأل نفسك المستقبلية أسئلة مهمة',
          'ضع الرسالة في مكان آمن للمستقبل',
          'حدد تاريخ لفتح الرسالة'
        ]
      };
    } else if (hobbyName.includes('فيديو ثانية') || hobbyName.includes('1 Second')) {
      return {
        benefits: [
          'توثيق الحياة اليومية بطريقة إبداعية',
          'تطوير مهارات التصوير والمونتاج',
          'خلق ذكريات جميلة للمراجعة',
          'تحسين الملاحظة للتفاصيل',
          'مشاركة اللحظات مع الأحباب'
        ],
        requirements: ['جوال بكاميرا', 'تطبيق تصوير', 'إبداع في اختيار اللحظات'],
        apps: [
          { name: '1 Second Everyday', description: 'التطبيق الأصلي لفيديو الثانية الواحدة' },
          { name: 'Hyperlapse', description: 'فيديوهات سريعة من Instagram' },
          { name: 'Splice', description: 'تحرير فيديو بسيط ومجاني' },
          { name: 'InShot', description: 'محرر فيديو شامل للجوال' }
        ],
        websites: [
          { name: '1SE Community', url: '1se.co', description: 'مجتمع مستخدمي التطبيق' },
          { name: 'Video Editing Tips', url: 'youtube.com', description: 'نصائح تحرير الفيديو' }
        ],
        tips: [
          'صور ثانية واحدة كل ساعة أو عند الأحداث المهمة',
          'نوع في زوايا التصوير والمواضيع',
          'استخدم الإضاءة الطبيعية قدر الإمكان',
          'اجمع الفيديوهات في نهاية الشهر',
          'شارك الفيديو النهائي مع الأصدقاء'
        ]
      };
    } else if (hobbyName.includes('لوحة أحلام') || hobbyName.includes('Pinterest') || hobbyName.includes('Canva')) {
      return {
        benefits: [
          'تصور الأهداف والأحلام بصرياً',
          'تحفيز اللاوعي لتحقيق الأحلام',
          'تطوير الذوق الفني والتصميمي',
          'تنظيم الأفكار والخطط',
          'الإلهام المستمر والتحفيز'
        ],
        requirements: ['جوال أو كمبيوتر', 'اتصال إنترنت', 'رؤية واضحة للأهداف'],
        apps: [
          { name: 'Pinterest', description: 'أفضل تطبيق لإنشاء لوحات الأحلام' },
          { name: 'Canva', description: 'تصميم لوحات أحلام احترافية' },
          { name: 'Vision Board', description: 'تطبيق مخصص للوحات الأحلام' },
          { name: 'DreamItAlive', description: 'لوحة أحلام تفاعلية' }
        ],
        websites: [
          { name: 'Pinterest', url: 'pinterest.com', description: 'منصة الصور والأفكار الأشهر' },
          { name: 'Canva', url: 'canva.com', description: 'أداة تصميم مجانية' },
          { name: 'Vision Board Ideas', url: 'visionboardideas.com', description: 'أفكار للوحات الأحلام' }
        ],
        tips: [
          'اختر 10 صور تمثل أحلامك الحقيقية',
          'نظم الصور في فئات (عمل، سفر، صحة)',
          'استخدم ألوان تحفزك وتسعدك',
          'راجع لوحة أحلامك يومياً',
          'حديث اللوحة كلما تطورت أحلامك'
        ]
      };
    } else if (hobbyName.includes('نحت الصابون')) {
      return {
        benefits: [
          'تطوير المهارات الحركية الدقيقة',
          'الاسترخاء وتقليل التوتر',
          'إنتاج قطع فنية مفيدة',
          'تحسين التركيز والصبر',
          'استخدام مواد بسيطة ومتاحة'
        ],
        requirements: ['قطع صابون', 'سكين بلاستيك أو أدوات نحت', 'منشفة', 'صبر وتركيز'],
        apps: [
          { name: 'Sculpting Techniques', description: 'تقنيات النحت للمبتدئين' },
          { name: 'Soap Carving Guide', description: 'دليل نحت الصابون خطوة بخطوة' },
          { name: 'Art Tutorials', description: 'دروس فنية متنوعة' }
        ],
        websites: [
          { name: 'Soap Carving Tutorial', url: 'youtube.com', description: 'فيديوهات تعليمية مجانية' },
          { name: 'Craft Ideas', url: 'craftideas.com', description: 'أفكار حرفية إبداعية' }
        ],
        tips: [
          'ابدأ بأشكال بسيطة مثل القلب والنجمة',
          'استخدم صابون طري وليس صلب جداً',
          'اعمل ببطء وحذر لتجنب الكسر',
          'احتفظ بالقطع المنحوتة كهدايا',
          'تدرب على قطع صغيرة أولاً'
        ]
      };
    } else if (hobbyName.includes('برطمان الذكريات') || hobbyName.includes('ذكريات يومية')) {
      return {
        benefits: [
          'الاحتفاظ بالذكريات الجميلة',
          'تطوير عادة التفكير الإيجابي',
          'تحسين الصحة النفسية',
          'توثيق رحلة الحياة',
          'مراجعة الإنجازات والنمو'
        ],
        requirements: ['برطمان زجاجي', 'ورق ملون', 'قلم', 'شرائط للتزيين'],
        apps: [
          { name: 'Memory Jar', description: 'برطمان ذكريات رقمي' },
          { name: 'Gratitude Journal', description: 'يوميات الامتنان والذكريات' },
          { name: 'Day One', description: 'تطبيق يوميات شامل' },
          { name: 'Journey', description: 'كتابة وحفظ الذكريات' }
        ],
        websites: [
          { name: 'Memory Keeping Ideas', url: 'memorykeeping.com', description: 'أفكار لحفظ الذكريات' },
          { name: 'DIY Memory Jar', url: 'diyprojects.com', description: 'صنع برطمان الذكريات' }
        ],
        tips: [
          'اكتب 5 أشياء جميلة حدثت كل يوم',
          'استخدم ورق ملون مختلف للمناسبات',
          'زين البرطمان بطريقة تسعدك',
          'اقرأ الذكريات في نهاية الشهر',
          'اجعل الكتابة عادة يومية'
        ]
      };
    } else if (hobbyName.includes('تذوق الشاي') || hobbyName.includes('أنواع الشاي')) {
      return {
        benefits: [
          'تطوير حاسة التذوق والاستمتاع',
          'الاسترخاء وتقليل التوتر',
          'تعلم ثقافات مختلفة',
          'تحسين عملية الهضم',
          'اكتشاف نكهات وروائح جديدة'
        ],
        requirements: ['أنواع شاي مختلفة', 'كؤوس للتذوق', 'ماء ساخن', 'دفتر ملاحظات'],
        apps: [
          { name: 'Tea Tasting Notes', description: 'تطبيق لتسجيل ملاحظات تذوق الشاي' },
          { name: 'Tea Timer', description: 'مؤقت لأوقات النقع المثالية' },
          { name: 'World of Tea', description: 'دليل شامل لأنواع الشاي' },
          { name: 'Tea Journey', description: 'تتبع رحلة تذوق الشاي' }
        ],
        websites: [
          { name: 'Tea Association', url: 'teaassociation.org', description: 'معلومات شاملة عن الشاي' },
          { name: 'Tea Tasting Guide', url: 'teaguide.com', description: 'دليل تذوق الشاي' },
          { name: 'العالم العربي للشاي', url: 'arabtea.com', description: 'موقع عربي متخصص' }
        ],
        tips: [
          'ابدأ بثلاثة أنواع مختلفة',
          'اشرب الشاي بدون سكر للتذوق الحقيقي',
          'سجل اللون والرائحة والطعم',
          'جرب أوقات نقع مختلفة',
          'قارن بين الأنواع في نفس الجلسة'
        ]
      };
    } else if (hobbyName.includes('رسم على أكياس الشاي')) {
      return {
        benefits: [
          'إعادة تدوير إبداعية للمواد',
          'تطوير مهارات الرسم المصغر',
          'إنتاج قطع فنية فريدة',
          'تحسين الدقة والتركيز',
          'الاستمتاع بفن بسيط ومميز'
        ],
        requirements: ['أكياس شاي مستعملة', 'أقلام رسم دقيقة', 'ألوان مائية', 'مجفف شعر'],
        apps: [
          { name: 'Miniature Art', description: 'دروس الرسم المصغر' },
          { name: 'Tea Bag Art Gallery', description: 'معرض لفن أكياس الشاي' },
          { name: 'Upcycling Ideas', description: 'أفكار إعادة التدوير الإبداعي' },
          { name: 'Watercolor Techniques', description: 'تقنيات الألوان المائية' }
        ],
        websites: [
          { name: 'Tea Bag Art', url: 'teabagart.com', description: 'مجتمع فناني أكياس الشاي' },
          { name: 'Miniature Painting', url: 'minipainting.com', description: 'تقنيات الرسم المصغر' },
          { name: 'Upcycling Art', url: 'upcyclingart.org', description: 'فن إعادة التدوير' }
        ],
        tips: [
          'جفف أكياس الشاي جيداً قبل الرسم',
          'استخدم أقلام دقيقة للتفاصيل',
          'ابدأ برسومات بسيطة',
          'استخدم ألوان مائية خفيفة',
          'اتركها تجف تماماً قبل اللمس'
        ]
      };
    } else if (hobbyName.includes('صناعة شموع') || hobbyName.includes('شموع من البقايا')) {
      return {
        benefits: [
          'إعادة تدوير مفيدة واقتصادية',
          'إنتاج شموع مخصصة بروائح مفضلة',
          'تطوير مهارات حرفية جديدة',
          'خلق أجواء مريحة في المنزل',
          'صنع هدايا شخصية مميزة'
        ],
        requirements: ['بقايا شموع', 'قوالب أو أكواب', 'فتائل جديدة', 'زيوت عطرية (اختياري)'],
        apps: [
          { name: 'Candle Making Guide', description: 'دليل شامل لصناعة الشموع' },
          { name: 'Fragrance Calculator', description: 'حساب كمية العطور المطلوبة' },
          { name: 'DIY Crafts', description: 'أفكار حرفية منزلية' },
          { name: 'Candle Timer', description: 'تتبع أوقات الذوبان والتجمد' }
        ],
        websites: [
          { name: 'Candle Making Supplies', url: 'candlemaking.com', description: 'مستلزمات صناعة الشموع' },
          { name: 'DIY Candles', url: 'diycandles.org', description: 'دروس صناعة الشموع' },
          { name: 'صناعة الشموع', url: 'shamoo3.com', description: 'موقع عربي متخصص' }
        ],
        tips: [
          'اذب الشموع في حمام مائي لتجنب الحرق',
          'أضف العطر عندما يبرد الشمع قليلاً',
          'ثبت الفتيل في وسط القالب',
          'اتركها تبرد ببطء للحصول على سطح أملس',
          'قص الفتيل لطول مناسب قبل الإشعال'
        ]
      };
    } else if (hobbyName.includes('تلوين تأملي') || hobbyName.includes('ماندالا')) {
      return {
        benefits: [
          'تقليل التوتر والقلق بشكل كبير',
          'تحسين التركيز والانتباه',
          'تطوير الصبر والهدوء الداخلي',
          'تحفيز الإبداع والخيال',
          'ممارسة نوع من التأمل النشط'
        ],
        requirements: ['كتب تلوين أو أوراق ماندالا', 'أقلام ملونة', 'موسيقى هادئة', 'مكان مريح'],
        apps: [
          { name: 'Colorfy', description: 'تطبيق تلوين رقمي للكبار' },
          { name: 'Mandala Coloring', description: 'تلوين ماندالا رقمي' },
          { name: 'Adult Coloring Book', description: 'كتاب تلوين رقمي شامل' },
          { name: 'Zen Coloring', description: 'تلوين تأملي مع موسيقى' }
        ],
        websites: [
          { name: 'Free Mandala', url: 'freemandala.com', description: 'ماندالا مجانية للطباعة' },
          { name: 'Coloring Pages', url: 'coloringpages.com', description: 'صفحات تلوين متنوعة' },
          { name: 'تلوين عربي', url: 'coloring-ar.com', description: 'صفحات تلوين عربية' }
        ],
        tips: [
          'اختر وقت هادئ بدون مقاطعات',
          'شغل موسيقى هادئة في الخلفية',
          'لا تقلق من النتيجة النهائية',
          'ركز على عملية التلوين وليس النتيجة',
          'تنفس بعمق أثناء التلوين'
        ]
      };
    } else if (hobbyName.includes('يوميات الامتنان') || hobbyName.includes('امتنان')) {
      return {
        benefits: [
          'تحسين الصحة النفسية والسعادة',
          'تطوير نظرة إيجابية للحياة',
          'تقليل التوتر والاكتئاب',
          'تعزيز الشعور بالرضا',
          'تقوية العلاقات الاجتماعية'
        ],
        requirements: ['دفتر صغير', 'قلم', '5 دقائق يومياً', 'تركيز على الأشياء الإيجابية'],
        apps: [
          { name: 'Gratitude Journal', description: 'تطبيق يوميات الامتنان المتخصص' },
          { name: 'Five Minute Journal', description: 'يوميات الخمس دقائق' },
          { name: 'Day One', description: 'تطبيق يوميات شامل' },
          { name: 'Thankful', description: 'تطبيق بسيط للامتنان اليومي' }
        ],
        websites: [
          { name: 'Gratitude Practice', url: 'gratitudepractice.org', description: 'دليل ممارسة الامتنان' },
          { name: 'Positive Psychology', url: 'positivepsychology.com', description: 'علم النفس الإيجابي' },
          { name: 'الامتنان في الإسلام', url: 'islamweb.net', description: 'الامتنان من منظور إسلامي' }
        ],
        tips: [
          'اكتب 3 أشياء تشعر بالامتنان لها يومياً',
          'كن محدداً في وصف الأشياء',
          'اكتب عن أشخاص وليس فقط أشياء',
          'راجع ما كتبته في الأيام الصعبة',
          'شارك امتنانك مع الآخرين'
        ]
      };
    } else if (hobbyName.includes('مراقبة الطيور') || hobbyName.includes('طيور من النافذة')) {
      return {
        benefits: [
          'الاتصال مع الطبيعة وتقليل التوتر',
          'تطوير مهارات الملاحظة والصبر',
          'تعلم أنواع الطيور المحلية',
          'تحسين التركيز والهدوء',
          'استمتاع مجاني بجمال الطبيعة'
        ],
        requirements: ['نافذة بإطلالة', 'مقعد مريح', 'دفتر ملاحظات', 'مناظير (اختياري)'],
        apps: [
          { name: 'Merlin Bird ID', description: 'تحديد الطيور بالصوت والصورة' },
          { name: 'eBird', description: 'تسجيل مشاهدات الطيور عالمياً' },
          { name: 'Bird Sounds', description: 'أصوات الطيور للتعرف عليها' },
          { name: 'Audubon Bird Guide', description: 'دليل شامل للطيور' }
        ],
        websites: [
          { name: 'All About Birds', url: 'allaboutbirds.org', description: 'موسوعة الطيور الشاملة' },
          { name: 'Bird Watching Tips', url: 'birdwatching.com', description: 'نصائح مراقبة الطيور' },
          { name: 'طيور الشرق الأوسط', url: 'middleeastbirds.com', description: 'طيور المنطقة العربية' }
        ],
        tips: [
          'اجلس بهدوء وتجنب الحركات المفاجئة',
          'راقب في الصباح الباكر أو المساء',
          'ضع بذور أو ماء لجذب الطيور',
          'سجل أنواع الطيور التي تراها',
          'تعلم التمييز بين الذكور والإناث'
        ]
      };
    } else if (hobbyName.includes('السفر الافتراضي') || hobbyName.includes('Google Earth')) {
      return {
        benefits: [
          'استكشاف العالم من المنزل',
          'توسيع المعرفة الجغرافية والثقافية',
          'التخطيط لرحلات مستقبلية',
          'تقليل التوتر بالهروب الافتراضي',
          'تعلم عن ثقافات وأماكن جديدة'
        ],
        requirements: ['جوال أو كمبيوتر', 'اتصال إنترنت جيد', 'فضول للاستكشاف'],
        apps: [
          { name: 'Google Earth', description: 'استكشاف الأرض بالصور الفضائية' },
          { name: 'Street View', description: 'جولات افتراضية في الشوارع' },
          { name: 'World Atlas', description: 'أطلس عالمي تفاعلي' },
          { name: 'Virtual Travel', description: 'تطبيق السفر الافتراضي' }
        ],
        websites: [
          { name: 'Google Earth', url: 'earth.google.com', description: 'النسخة الويب من Google Earth' },
          { name: 'Virtual Museum Tours', url: 'virtualmuseums.io', description: 'جولات افتراضية في المتاحف' },
          { name: 'World Cam', url: 'worldcam.eu', description: 'كاميرات مباشرة من حول العالم' }
        ],
        tips: [
          'اختر دولة عشوائية لاستكشافها',
          'ابحث عن المعالم الشهيرة',
          'استخدم Street View للجولات',
          'تعلم حقائق مثيرة عن الأماكن',
          'شارك الاكتشافات مع الأصدقاء'
        ]
      };
    } else if (hobbyName.includes('تنظيم الهاتف') || hobbyName.includes('Widgetsmith')) {
      return {
        benefits: [
          'تحسين الإنتاجية وسهولة الوصول',
          'تطوير مهارات التنظيم الرقمي',
          'تخصيص الجوال ليعكس شخصيتك',
          'تقليل الوقت المهدر في البحث',
          'إنشاء بيئة رقمية جميلة ومنظمة'
        ],
        requirements: ['جوال ذكي', 'تطبيقات التخصيص', 'ذوق في التصميم', 'صبر للتنظيم'],
        apps: [
          { name: 'Widgetsmith', description: 'إنشاء ويدجت مخصصة لآيفون' },
          { name: 'Shortcuts', description: 'إنشاء اختصارات مخصصة' },
          { name: 'Nova Launcher', description: 'لانشر مخصص لأندرويد' },
          { name: 'KWGT', description: 'ويدجت مخصصة لأندرويد' }
        ],
        websites: [
          { name: 'iPhone Setup Ideas', url: 'iphonesetup.com', description: 'أفكار تنظيم الآيفون' },
          { name: 'Android Customization', url: 'androidcustom.com', description: 'تخصيص الأندرويد' },
          { name: 'Widget Ideas', url: 'widgetideas.net', description: 'أفكار للويدجت' }
        ],
        tips: [
          'نظم التطبيقات في مجلدات حسب الاستخدام',
          'استخدم ويدجت للمعلومات المهمة',
          'اختر خلفية تناسب الويدجت',
          'قلل عدد التطبيقات في الشاشة الرئيسية',
          'استخدم الاختصارات للمهام المتكررة'
        ]
      };
    } else if (hobbyName.includes('حل الألغاز') || hobbyName.includes('ألغاز ذهنية')) {
      return {
        benefits: [
          'تحسين القدرات الذهنية والذاكرة',
          'تطوير مهارات حل المشاكل',
          'تأخير علامات الشيخوخة الذهنية',
          'زيادة التركيز والانتباه',
          'الاستمتاع بالتحدي الذهني'
        ],
        requirements: ['جوال أو كمبيوتر', 'تركيز ذهني', 'صبر ومثابرة'],
        apps: [
          { name: 'Lumosity', description: 'ألعاب تدريب الدماغ العلمية' },
          { name: 'Peak', description: 'ألغاز وتحديات ذهنية متنوعة' },
          { name: 'Puzzle Baron', description: 'موقع ألغاز متخصص' },
          { name: 'Brain Training', description: 'تدريب الدماغ الشامل' }
        ],
        websites: [
          { name: 'Puzzle Baron', url: 'puzzlebaron.com', description: 'مجموعة ضخمة من الألغاز' },
          { name: 'Brain Games', url: 'braingames.com', description: 'ألعاب العقل المجانية' },
          { name: 'ألغاز عربية', url: 'alghaz.net', description: 'ألغاز باللغة العربية' }
        ],
        tips: [
          'ابدأ بألغاز سهلة ثم زد الصعوبة',
          'حل لغز واحد يومياً كحد أدنى',
          'نوع في أنواع الألغاز (رياضية، منطقية، لغوية)',
          'لا تستسلم بسرعة - فكر من زوايا مختلفة',
          'شارك الألغاز الصعبة مع الآخرين'
        ]
      };
    } else if (hobbyName.includes('ضغط الأوراق') || hobbyName.includes('ضغط الزهور')) {
      return {
        benefits: [
          'حفظ جمال الطبيعة إلى الأبد',
          'إنشاء ديكورات طبيعية جميلة',
          'تطوير الصبر والدقة',
          'الاتصال العميق مع الطبيعة',
          'إنتاج هدايا طبيعية فريدة'
        ],
        requirements: ['أوراق وزهور طازجة', 'كتب ثقيلة', 'ورق نشاف', 'صبر لأسابيع'],
        apps: [
          { name: 'Plant Press Guide', description: 'دليل ضغط النباتات' },
          { name: 'Flower Identification', description: 'تحديد أنواع الزهور' },
          { name: 'Pressed Flower Art', description: 'فن الزهور المضغوطة' },
          { name: 'Nature Journal', description: 'يوميات الطبيعة' }
        ],
        websites: [
          { name: 'Pressed Flower Art', url: 'pressedflowerart.com', description: 'تقنيات ضغط الزهور' },
          { name: 'Botanical Pressing', url: 'botanicalpress.org', description: 'الضغط النباتي التقليدي' },
          { name: 'Nature Crafts', url: 'naturecrafts.com', description: 'حرف طبيعية' }
        ],
        tips: [
          'اختر أوراق وزهور في أفضل حالاتها',
          'جفف النباتات بالمناديل أولاً',
          'ضعها بين ورق نشاف في كتاب ثقيل',
          'انتظر 2-4 أسابيع للجفاف الكامل',
          'استخدمها في إطارات أو بطاقات'
        ]
      };
    } else if (hobbyName.includes('تعلم كلمات بلغة جديدة') || hobbyName.includes('Duolingo')) {
      return {
        benefits: [
          'توسيع الآفاق الثقافية والمهنية',
          'تحسين الذاكرة والقدرات الذهنية',
          'فتح فرص سفر وعمل جديدة',
          'التواصل مع أشخاص من ثقافات مختلفة',
          'تطوير الثقة بالنفس'
        ],
        requirements: ['جوال أو كمبيوتر', '15 دقيقة يومياً', 'دافع قوي للتعلم'],
        apps: [
          { name: 'Duolingo', description: 'أشهر تطبيق تعلم اللغات مجاناً' },
          { name: 'Babbel', description: 'دروس لغة تفاعلية شاملة' },
          { name: 'Busuu', description: 'تعلم اللغات مع متحدثين أصليين' },
          { name: 'Memrise', description: 'حفظ المفردات بتقنيات الذاكرة' }
        ],
        websites: [
          { name: 'Duolingo Web', url: 'duolingo.com', description: 'النسخة الويب المجانية' },
          { name: 'Language Exchange', url: 'languageexchange.com', description: 'تبادل اللغات مع الآخرين' },
          { name: 'Google Translate', url: 'translate.google.com', description: 'مترجم فوري ودليل نطق' }
        ],
        tips: [
          'ابدأ بـ 5 كلمات بسيطة: مرحبا، شكراً، كيف حالك',
          'تدرب يومياً ولو لـ 10 دقائق',
          'استخدم الكلمات الجديدة في جمل',
          'استمع لموسيقى باللغة الجديدة',
          'تحدث مع نفسك باللغة الجديدة'
        ]
      };
    } else if (hobbyName.includes('رسم الأشكال الهندسية') || hobbyName.includes('هندسية متداخلة')) {
      return {
        benefits: [
          'تطوير مهارات الرياضيات والهندسة',
          'تحسين الدقة والتركيز',
          'إنشاء تصميمات زخرفية جميلة',
          'تهدئة العقل والاسترخاء',
          'تطوير الحس الفني والجمالي'
        ],
        requirements: ['ورق رسم', 'قلم رصاص', 'مسطرة', 'برجل (كومباس)', 'ممحاة'],
        apps: [
          { name: 'Geometry Pad', description: 'رسم الأشكال الهندسية رقمياً' },
          { name: 'Sacred Geometry', description: 'أنماط الهندسة المقدسة' },
          { name: 'Mandala Creator', description: 'إنشاء أنماط هندسية دائرية' },
          { name: 'Pattern Design', description: 'تصميم الأنماط الهندسية' }
        ],
        websites: [
          { name: 'Geometric Patterns', url: 'geometricpatterns.com', description: 'أنماط هندسية متنوعة' },
          { name: 'Islamic Geometry', url: 'islamicgeometry.com', description: 'الهندسة الإسلامية التراثية' },
          { name: 'Math Art', url: 'mathart.org', description: 'الفن الرياضي والهندسي' }
        ],
        tips: [
          'ابدأ بأشكال بسيطة: دوائر، مربعات، مثلثات',
          'استخدم المسطرة والبرجل للدقة',
          'اربط الأشكال لتكوين أنماط متداخلة',
          'جرب ألوان مختلفة لتمييز الأشكال',
          'ادرس الأنماط التراثية للإلهام'
        ]
      };
    }
    
    // تفاصيل عامة للهوايات الأخرى
    return {
      benefits: [
        'تطوير مهارات جديدة ومفيدة',
        'قضاء وقت ممتع ومثمر',
        'تحسين الصحة النفسية والذهنية',
        'بناء الثقة بالنفس',
        'اكتشاف مواهب خفية'
      ],
      requirements: ['أدوات بسيطة', 'وقت للممارسة', 'مكان مناسب'],
      apps: [
        { name: 'YouTube', description: 'دروس تعليمية مجانية لكل الهوايات' },
        { name: 'Pinterest', description: 'أفكار وإلهام إبداعي متنوع' },
        { name: 'WikiHow', description: 'دليل خطوة بخطوة لتعلم المهارات' }
      ],
      websites: [
        { name: 'ويكيهاو', url: 'ar.wikihow.com', description: 'دليل خطوة بخطوة بالعربية' },
        { name: 'يوتيوب', url: 'youtube.com', description: 'فيديوهات تعليمية مجانية' },
        { name: 'Pinterest', url: 'pinterest.com', description: 'أفكار وإلهام بصري' }
      ],
      tips: [
        'ابدأ بخطوات بسيطة وواقعية',
        'تدرب بانتظام ولو لوقت قصير',
        'لا تخف من الأخطاء - هي جزء من التعلم',
        'استمتع بالعملية وليس فقط النتيجة',
        'شارك تجربتك مع الآخرين للتشجيع'
      ]
    };
  };

  if (!hobby) return null;

  const details = getHobbyDetails(hobby);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #FFB5E8 0%, #B5E8FF 100%)',
        color: '#4A4A4A',
        position: 'relative',
        pr: 6
      }}>
        <Typography variant="h5" fontWeight="bold" fontFamily="Patrick Hand">
          {hobby.name}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: '#4A4A4A'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography>جاري تحميل التفاصيل...</Typography>
          </Box>
        ) : (
          <Box>
            {/* معلومات أساسية */}
            <Box sx={{ p: 3, bgcolor: '#FFF9F9' }}>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontFamily: 'Quicksand' }}>
                {hobby.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item>
                  <Chip 
                    icon={<TrendingUp />}
                    label={hobby.skill_level} 
                    color={getSkillColor(hobby.skill_level)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <Chip 
                    icon={<MonetizationOn />}
                    label={hobby.cost_level} 
                    color={getCostColor(hobby.cost_level)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <Chip 
                    icon={<AccessTime />}
                    label={detailedInfo?.time_commitment || '15-30 دقيقة'}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* مساحة إعلان 1 */}
            <Paper sx={{ 
              m: 2, 
              p: 2, 
              bgcolor: '#F0F8FF', 
              border: '1px dashed #B5E8FF',
              textAlign: 'center',
              minHeight: 100
            }}>
              <Typography variant="body2" color="text.secondary">
                مساحة إعلانية - 728x90
              </Typography>
            </Paper>

            {/* الفوائد */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontFamily="Patrick Hand" sx={{ color: '#4A4A4A' }}>
                🌟 فوائد هذه الهواية
              </Typography>
              <List dense>
                {details.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#FFB5E8', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={benefit}
                      sx={{ '& .MuiListItemText-primary': { fontFamily: 'Quicksand' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* المتطلبات */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontFamily="Patrick Hand" sx={{ color: '#4A4A4A' }}>
                🛠️ ما تحتاجه للبدء
              </Typography>
              <Grid container spacing={1}>
                {details.requirements.map((req, index) => (
                  <Grid item key={index}>
                    <Chip 
                      label={req} 
                      variant="outlined" 
                      size="small"
                      sx={{ fontFamily: 'Quicksand' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* التطبيقات المساعدة */}
            <Box sx={{ p: 3, bgcolor: '#FFF9F9' }}>
              <Typography variant="h6" gutterBottom fontFamily="Patrick Hand" sx={{ color: '#4A4A4A' }}>
                📱 تطبيقات مساعدة
              </Typography>
              <Grid container spacing={2}>
                {details.apps.map((app, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ color: '#B5E8FF', mr: 1 }} />
                          <Typography variant="subtitle2" fontWeight="bold" fontFamily="Patrick Hand">
                            {app.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontFamily="Quicksand">
                          {app.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* مساحة إعلان 2 */}
            <Paper sx={{ 
              m: 2, 
              p: 2, 
              bgcolor: '#F0F8FF', 
              border: '1px dashed #E8B5FF',
              textAlign: 'center',
              minHeight: 100
            }}>
              <Typography variant="body2" color="text.secondary">
                مساحة إعلانية - 300x250
              </Typography>
            </Paper>

            {/* المواقع المفيدة */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontFamily="Patrick Hand" sx={{ color: '#4A4A4A' }}>
                🌐 مواقع مفيدة
              </Typography>
              <Grid container spacing={2}>
                {details.websites.map((site, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Language sx={{ color: '#E8B5FF', mr: 1 }} />
                          <Typography variant="subtitle2" fontWeight="bold" fontFamily="Patrick Hand">
                            {site.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontFamily="Quicksand">
                          {site.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* نصائح للنجاح */}
            <Box sx={{ p: 3, bgcolor: '#FFF9F9' }}>
              <Typography variant="h6" gutterBottom fontFamily="Patrick Hand" sx={{ color: '#4A4A4A' }}>
                💡 نصائح للنجاح
              </Typography>
              <List dense>
                {details.tips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Stars sx={{ color: '#FFE8B5', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={tip}
                      sx={{ '& .MuiListItemText-primary': { fontFamily: 'Quicksand' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* مساحة إعلان 3 */}
            <Paper sx={{ 
              m: 2, 
              p: 2, 
              bgcolor: '#F0F8FF', 
              border: '1px dashed #FFE8B5',
              textAlign: 'center',
              minHeight: 120
            }}>
              <Typography variant="body2" color="text.secondary">
                مساحة إعلانية - 336x280
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#FFF9F9' }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ fontFamily: 'Quicksand' }}
        >
          إغلاق
        </Button>
        <Button 
          variant="contained"
          startIcon={<PlayArrow />}
          sx={{ 
            bgcolor: '#FFB5E8',
            color: '#4A4A4A',
            fontFamily: 'Patrick Hand',
            '&:hover': { bgcolor: '#FF9ED6' }
          }}
        >
          ابدأ الآن!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HobbyDetailModal; 