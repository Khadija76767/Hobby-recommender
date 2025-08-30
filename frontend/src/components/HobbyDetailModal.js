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
    } else if (hobbyName.includes('صناعة العطور الطبيعية') || hobbyName.includes('عطور طبيعية')) {
      return {
        benefits: [
          'إنتاج عطور فريدة وشخصية',
          'تجنب المواد الكيميائية الضارة',
          'توفير المال مقارنة بالعطور التجارية',
          'تطوير معرفة بالزيوت الطبيعية',
          'نشاط مريح ومهدئ للأعصاب'
        ],
        requirements: ['زيوت عطرية طبيعية', 'زيت حامل (جوجوبا/اللوز)', 'قطارات', 'زجاجات صغيرة'],
        apps: [
          { name: 'Perfume Recipes', description: 'وصفات العطور الطبيعية' },
          { name: 'Essential Oil Guide', description: 'دليل الزيوت العطرية' },
          { name: 'Scent Blending', description: 'مزج الروائح والعطور' },
          { name: 'Natural Perfume Diary', description: 'يوميات العطور الطبيعية' }
        ],
        websites: [
          { name: 'Natural Perfumery', url: 'naturalperfumery.com', description: 'فن العطور الطبيعية' },
          { name: 'Essential Oil Safety', url: 'essentialoilsafety.org', description: 'أمان الزيوت العطرية' },
          { name: 'العطور العربية', url: 'arabicperfumes.net', description: 'تراث العطور العربية' }
        ],
        tips: [
          'ابدأ بـ 3 زيوت بسيطة: لافندر، ليمون، خشب الصندل',
          'استخدم نسبة 10% زيت عطري، 90% زيت حامل',
          'اتركها تنضج لأسبوع قبل الاستخدام',
          'اختبر على جزء صغير من الجلد أولاً',
          'احتفظ بالعطور في مكان بارد ومظلم'
        ]
      };
    } else if (hobbyName.includes('كتب مصغرة') || hobbyName.includes('صناعة كتب')) {
      return {
        benefits: [
          'تطوير مهارات الحرف اليدوية الدقيقة',
          'إنشاء هدايا شخصية مميزة',
          'تعلم تقنيات الطباعة والتجليد',
          'تطوير الصبر والدقة في العمل',
          'مهارة مفيدة لحفظ الذكريات'
        ],
        requirements: ['ورق عالي الجودة', 'مقص دقيق', 'غراء قوي', 'مسطرة صغيرة', 'إبرة وخيط'],
        apps: [
          { name: 'Book Design', description: 'تصميم الكتب والتخطيط' },
          { name: 'Miniature Guide', description: 'دليل الحرف المصغرة' },
          { name: 'Paper Craft', description: 'حرف الورق المتنوعة' },
          { name: 'Bookbinding Tutorial', description: 'دروس تجليد الكتب' }
        ],
        websites: [
          { name: 'Miniature Books Society', url: 'mbs.org', description: 'جمعية الكتب المصغرة' },
          { name: 'Bookbinding Guide', url: 'bookbinding.com', description: 'دليل تجليد الكتب' },
          { name: 'الكتب المصغرة', url: 'minibooks-ar.com', description: 'موقع عربي للكتب المصغرة' }
        ],
        tips: [
          'ابدأ بكتاب بسيط من 8 صفحات',
          'استخدم ورق رفيع عالي الجودة',
          'طبق ورقة اختبار أولاً',
          'استخدم مثقب ورق للتجليد',
          'أضف غلاف صلب من الكرتون'
        ]
      };
    } else if (hobbyName.includes('فن الكولاج') || hobbyName.includes('كولاج ملون')) {
      return {
        benefits: [
          'تطوير الإبداع والحس الفني',
          'إعادة تدوير المجلات والصور القديمة',
          'التعبير عن الأفكار بصرياً',
          'تحسين التنسيق والتكوين',
          'نشاط مريح ومهدئ'
        ],
        requirements: ['مجلات وصور قديمة', 'مقص', 'غراء', 'ورق أساس كبير', 'إبداع في التنسيق'],
        apps: [
          { name: 'Collage Maker', description: 'صنع كولاج رقمي احترافي' },
          { name: 'PicCollage', description: 'تطبيق كولاج بسيط وممتع' },
          { name: 'Moldiv', description: 'محرر كولاج متقدم' },
          { name: 'Adobe Photoshop Mix', description: 'مزج الصور والكولاج' }
        ],
        websites: [
          { name: 'Collage Art Techniques', url: 'collageartist.com', description: 'تقنيات فن الكولاج' },
          { name: 'Mixed Media Art', url: 'mixedmediaart.org', description: 'فن الوسائط المختلطة' },
          { name: 'فن الكولاج العربي', url: 'arabcollage.com', description: 'الكولاج في الفن العربي' }
        ],
        tips: [
          'اجمع مجلات وصور متنوعة الألوان',
          'فكر في موضوع أو فكرة رئيسية',
          'رتب القطع قبل اللصق',
          'استخدم طبقات مختلفة للعمق',
          'أضف تفاصيل بالقلم أو الألوان'
        ]
      };
    } else if (hobbyName.includes('النباتات المائية') || hobbyName.includes('زراعة مائية')) {
      return {
        benefits: [
          'تعلم تقنيات زراعة حديثة ونظيفة',
          'مراقبة نمو النباتات بوضوح',
          'تطوير مهارات العناية بالنباتات',
          'إنتاج نباتات صحية بدون تربة',
          'نشاط علمي تعليمي ممتع'
        ],
        requirements: ['بذور أو نباتات صغيرة', 'أوعية شفافة', 'محلول غذائي للنباتات', 'ماء نظيف'],
        apps: [
          { name: 'Hydroponic Guide', description: 'دليل الزراعة المائية الشامل' },
          { name: 'Plant Care Assistant', description: 'مساعد العناية بالنباتات' },
          { name: 'Growth Tracker', description: 'تتبع نمو النباتات' },
          { name: 'Garden Journal', description: 'يوميات الحديقة' }
        ],
        websites: [
          { name: 'Hydroponic Society', url: 'hydroponics.org', description: 'جمعية الزراعة المائية' },
          { name: 'Simple Hydroponics', url: 'simplehydroponics.com', description: 'زراعة مائية بسيطة' },
          { name: 'الزراعة المائية العربية', url: 'arabhydro.com', description: 'موقع عربي متخصص' }
        ],
        tips: [
          'ابدأ بنباتات سهلة مثل الخس والريحان',
          'غير الماء كل أسبوع',
          'ضع النباتات في مكان مضيء',
          'راقب جذور النباتات بانتظام',
          'أضف السماد المائي حسب التعليمات'
        ]
      };
    } else if (hobbyName.includes('البرمجة الإبداعية') || hobbyName.includes('برمجة للمبتدئين')) {
      return {
        benefits: [
          'تطوير مهارات التفكير المنطقي',
          'فتح فرص مهنية في التكنولوجيا',
          'تحسين قدرات حل المشاكل',
          'إنشاء مشاريع إبداعية رقمية',
          'مهارة أساسية في العصر الحديث'
        ],
        requirements: ['جوال أو كمبيوتر', 'اتصال إنترنت', 'صبر للتعلم', 'فضول تقني'],
        apps: [
          { name: 'SoloLearn', description: 'تعلم البرمجة تفاعلياً مجاناً' },
          { name: 'Grasshopper', description: 'تعلم JavaScript للمبتدئين' },
          { name: 'Scratch', description: 'برمجة مرئية للأطفال والمبتدئين' },
          { name: 'Codecademy Go', description: 'دروس برمجة سريعة' }
        ],
        websites: [
          { name: 'FreeCodeCamp', url: 'freecodecamp.org', description: 'تعلم البرمجة مجاناً بالكامل' },
          { name: 'Scratch', url: 'scratch.mit.edu', description: 'برمجة مرئية من MIT' },
          { name: 'البرمجة العربية', url: 'arabicprogramming.com', description: 'تعلم البرمجة بالعربية' }
        ],
        tips: [
          'ابدأ بـ Scratch للبرمجة المرئية',
          'تعلم Python كأول لغة برمجة',
          'مارس يومياً ولو لـ 15 دقيقة',
          'ابن مشاريع صغيرة للتطبيق',
          'انضم لمجتمعات البرمجة العربية'
        ]
      };
    } else if (hobbyName.includes('الأحجار الملونة') || hobbyName.includes('جمع وترتيب الأحجار')) {
      return {
        benefits: [
          'الاتصال مع الطبيعة والاسترخاء',
          'تطوير مهارات التصنيف والتنظيم',
          'إنشاء مجموعات طبيعية جميلة',
          'تعلم عن الجيولوجيا والمعادن',
          'نشاط تأملي مهدئ للأعصاب'
        ],
        requirements: ['أحجار متنوعة', 'صناديق تنظيم', 'عدسة مكبرة', 'بطاقات تسمية'],
        apps: [
          { name: 'Rock Identifier', description: 'تحديد أنواع الأحجار والمعادن' },
          { name: 'Geology Toolkit', description: 'أدوات الجيولوجيا الرقمية' },
          { name: 'Stone Collection', description: 'تطبيق لتنظيم مجموعة الأحجار' },
          { name: 'Mineral Guide', description: 'دليل المعادن والبلورات' }
        ],
        websites: [
          { name: 'Rock and Mineral Guide', url: 'rockandmineralguide.com', description: 'دليل شامل للأحجار' },
          { name: 'Geology.com', url: 'geology.com', description: 'موقع الجيولوجيا الشامل' },
          { name: 'الأحجار الكريمة العربية', url: 'arabstones.net', description: 'موقع عربي للأحجار' }
        ],
        tips: [
          'ابحث عن أحجار في الطبيعة أو الشواطئ',
          'صنف الأحجار حسب اللون أو الشكل',
          'نظف الأحجار بالماء والفرشاة',
          'ضع بطاقة لكل حجر مع اسمه ومصدره',
          'أنشئ عرض جميل في صندوق أو رف'
        ]
      };
    } else if (hobbyName.includes('فن الخط العربي') || hobbyName.includes('خط عربي')) {
      return {
        benefits: [
          'إحياء التراث العربي الأصيل',
          'تطوير مهارات الكتابة والخط',
          'تحسين التركيز والصبر',
          'إنتاج قطع فنية تراثية جميلة',
          'تعميق الصلة باللغة العربية'
        ],
        requirements: ['قلم خط عربي (قصب أو معدني)', 'حبر أو ألوان مائية', 'ورق خط', 'مسطرة'],
        apps: [
          { name: 'Arabic Calligraphy', description: 'تعليم الخط العربي رقمياً' },
          { name: 'Khat Practice', description: 'تطبيق تدريب الخط العربي' },
          { name: 'Islamic Art', description: 'الفن الإسلامي والخط العربي' },
          { name: 'Typography Arabic', description: 'خطوط عربية رقمية' }
        ],
        websites: [
          { name: 'الخط العربي', url: 'arabcalligraphy.org', description: 'موقع متخصص بالخط العربي' },
          { name: 'مؤسسة الخط العربي', url: 'arabicfonts.org', description: 'تراث الخط العربي' },
          { name: 'دروس الخط', url: 'khattutorials.com', description: 'دروس خط عربي مجانية' }
        ],
        tips: [
          'ابدأ بخط النسخ البسيط',
          'تدرب على الحروف منفردة أولاً',
          'استخدم ورق مسطر للانتظام',
          'تعلم قواعد التشكيل والتنقيط',
          'اكتب آيات قرآنية أو أبيات شعر'
        ]
      };
    } else if (hobbyName.includes('إطعام ومراقبة الطيور') || hobbyName.includes('إطعام الطيور')) {
      return {
        benefits: [
          'الاتصال مع الطبيعة والحياة البرية',
          'المساهمة في حماية البيئة',
          'مراقبة سلوك الطيور وتعلم أنواعها',
          'الشعور بالسعادة من مساعدة الحيوانات',
          'نشاط مريح ومهدئ للأعصاب'
        ],
        requirements: ['بذور طيور', 'ماء نظيف', 'أطباق صغيرة', 'مكان آمن للطيور'],
        apps: [
          { name: 'Bird Feeding Guide', description: 'دليل إطعام الطيور الصحيح' },
          { name: 'Bird Species ID', description: 'تحديد أنواع الطيور المحلية' },
          { name: 'Wildlife Camera', description: 'مراقبة الطيور بالكاميرا' },
          { name: 'Birding Journal', description: 'يوميات مراقبة الطيور' }
        ],
        websites: [
          { name: 'All About Birds', url: 'allaboutbirds.org', description: 'كل شيء عن الطيور' },
          { name: 'Bird Feeding Central', url: 'birdfeeding.org', description: 'مركز إطعام الطيور' },
          { name: 'طيور الشرق الأوسط', url: 'middleeastbirds.org', description: 'طيور المنطقة العربية' }
        ],
        tips: [
          'ضع البذور في مكان آمن من القطط',
          'استخدم بذور عباد الشمس والذرة',
          'غير الماء يومياً ونظف الأطباق',
          'ضع الطعام في نفس الوقت يومياً',
          'راقب من بعيد لعدم إخافة الطيور'
        ]
      };
    } else if (hobbyName.includes('ألعاب ورقية') || hobbyName.includes('ابتكار ألعاب')) {
      return {
        benefits: [
          'تطوير الإبداع والتفكير الاستراتيجي',
          'تحسين مهارات التصميم والقوانين',
          'خلق ألعاب ممتعة للأصدقاء والعائلة',
          'تطوير مهارات حل المشاكل',
          'فهم آليات الألعاب والتحفيز'
        ],
        requirements: ['أوراق كرتون', 'أقلام ملونة', 'مقص', 'إبداع في القوانين', 'أصدقاء للاختبار'],
        apps: [
          { name: 'Game Design Studio', description: 'استوديو تصميم الألعاب' },
          { name: 'Card Creator', description: 'إنشاء بطاقات ألعاب مخصصة' },
          { name: 'Board Game Designer', description: 'مصمم ألعاب الطاولة' },
          { name: 'Rules Generator', description: 'مولد قوانين الألعاب' }
        ],
        websites: [
          { name: 'Board Game Geek', url: 'boardgamegeek.com', description: 'مجتمع محبي ألعاب الطاولة' },
          { name: 'Game Design Workshop', url: 'gamedesignworkshop.com', description: 'ورشة تصميم الألعاب' },
          { name: 'الألعاب العربية', url: 'arabgames.org', description: 'تراث الألعاب العربية' }
        ],
        tips: [
          'ابدأ بلعبة بسيطة مثل لعبة الذاكرة',
          'اكتب قوانين واضحة ومفهومة',
          'اختبر اللعبة مع أصدقاء مختلفين',
          'عدل القوانين حسب التجربة',
          'أضف رسومات وألوان جذابة'
        ]
      };
    } else if (hobbyName.includes('تمارين التنفس') || hobbyName.includes('تأمل')) {
      return {
        benefits: [
          'تقليل التوتر والقلق بشكل فعال',
          'تحسين التركيز والوضوح الذهني',
          'تحسين جودة النوم والاسترخاء',
          'تقوية الجهاز المناعي',
          'زيادة الشعور بالهدوء والسكينة'
        ],
        requirements: ['مكان هادئ', 'وضعية مريحة', '10-15 دقيقة يومياً', 'صبر وممارسة منتظمة'],
        apps: [
          { name: 'Headspace', description: 'تطبيق التأمل والتنفس الأشهر' },
          { name: 'Calm', description: 'تطبيق الهدوء والاسترخاء' },
          { name: 'Insight Timer', description: 'مؤقت التأمل مع مجتمع' },
          { name: 'Breathe', description: 'تطبيق متخصص بتمارين التنفس' }
        ],
        websites: [
          { name: 'Mindfulness Guide', url: 'mindfulness.org', description: 'دليل اليقظة الذهنية' },
          { name: 'Breathing Techniques', url: 'breathingtechniques.com', description: 'تقنيات التنفس المختلفة' },
          { name: 'التأمل في الإسلام', url: 'islammeditation.com', description: 'التأمل من منظور إسلامي' }
        ],
        tips: [
          'ابدأ بتمرين 4-7-8: شهيق 4، احتجاز 7، زفير 8',
          'تدرب في نفس الوقت يومياً',
          'ركز على حركة البطن أثناء التنفس',
          'لا تجبر نفسك، اجعل التنفس طبيعياً',
          'استخدم تطبيق لتتبع الجلسات'
        ]
      };
    } else if (hobbyName.includes('عقد الحبال') || hobbyName.includes('تعلم عقد')) {
      return {
        benefits: [
          'تعلم مهارات عملية مفيدة للحياة',
          'تطوير المهارات الحركية الدقيقة',
          'تحسين التركيز والذاكرة',
          'مهارات مفيدة للرياضة والرحلات',
          'تطوير الصبر والمثابرة'
        ],
        requirements: ['حبال بأسماك مختلفة', 'دليل عقد مصور', 'صبر للتدريب', 'يدين مرنتين'],
        apps: [
          { name: 'Knots 3D', description: 'تعليم العقد بتقنية ثلاثية الأبعاد' },
          { name: 'Animated Knots', description: 'عقد متحركة للتعلم السهل' },
          { name: 'Scout Knots', description: 'عقد الكشافة الأساسية' },
          { name: 'Sailing Knots', description: 'عقد الإبحار والبحرية' }
        ],
        websites: [
          { name: 'Animated Knots', url: 'animatedknots.com', description: 'موقع العقد المتحركة الشامل' },
          { name: 'Scout Knots', url: 'scoutknots.com', description: 'عقد الكشافة التقليدية' },
          { name: 'عقد الحبال العربية', url: 'arabknots.com', description: 'العقد في التراث العربي' }
        ],
        tips: [
          'ابدأ بعقد بسيطة: العقدة المربعة والوتدية',
          'تدرب بحبل ملون لسهولة التتبع',
          'كرر كل عقدة حتى تحفظها',
          'تعلم استخدامات كل عقدة',
          'تدرب في أوقات الانتظار'
        ]
      };
    } else if (hobbyName.includes('الإكسسوارات البسيطة') || hobbyName.includes('صناعة إكسسوارات')) {
      return {
        benefits: [
          'إنتاج قطع فريدة تعبر عن شخصيتك',
          'توفير المال مقارنة بالشراء',
          'تطوير المهارات الحرفية والإبداعية',
          'صنع هدايا شخصية مميزة',
          'إعادة تدوير المواد القديمة'
        ],
        requirements: ['خرز وخيوط', 'أسلاك رفيعة', 'كماشة صغيرة', 'مقص', 'إبداع في التصميم'],
        apps: [
          { name: 'Jewelry Design', description: 'تصميم المجوهرات والإكسسوارات' },
          { name: 'Beading Patterns', description: 'أنماط الخرز والتطريز' },
          { name: 'DIY Jewelry', description: 'صنع الإكسسوارات بنفسك' },
          { name: 'Craft Ideas', description: 'أفكار حرفية متنوعة' }
        ],
        websites: [
          { name: 'Fire Mountain Gems', url: 'firemountaingems.com', description: 'مستلزمات صناعة المجوهرات' },
          { name: 'Jewelry Making Daily', url: 'jewelrymakingdaily.com', description: 'يوميات صناعة المجوهرات' },
          { name: 'الإكسسوارات العربية', url: 'arabaccessories.com', description: 'الإكسسوارات التراثية' }
        ],
        tips: [
          'ابدأ بسوار بسيط من الخرز',
          'استخدم خيوط قوية ومرنة',
          'قس المعصم أو الرقبة قبل البدء',
          'نوع في الألوان والأحجام',
          'أضف قفل آمن للإكسسوار'
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