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

  // بيانات تفصيلية حسب نوع الهواية
  const getHobbyDetails = (hobby) => {
    const category = hobby?.category || '';
    
    if (category.includes('روحانية')) {
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
          { name: 'آيات', description: 'تذكيرات يومية وبرنامج حفظ تدريجي' }
        ],
        websites: [
          { name: 'موقع القرآن الكريم', url: 'quran.com', description: 'مصحف شامل مع التفاسير' },
          { name: 'تدبر', url: 'tadabbur.com', description: 'منصة لتدبر وفهم القرآن' }
        ],
        tips: [
          'ابدأ بآية واحدة واتقنها قبل الانتقال للتالية',
          'اختر وقت صافي الذهن مثل بعد الفجر',
          'استمع للآية عدة مرات قبل الحفظ',
          'راجع ما حفظته يومياً',
          'ادع الله أن يعينك على الحفظ والفهم'
        ]
      };
    } else if (category.includes('فنون رقمية')) {
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
          { name: 'ArtRage', description: 'محاكاة رسم تقليدي على الشاشة' }
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
    } else if (category.includes('طبيعة')) {
      return {
        benefits: [
          'الاتصال مع الطبيعة وتقليل التوتر',
          'تعلم الصبر ومراقبة النمو',
          'تحسين جودة الهواء في المنزل',
          'تطوير المسؤولية والاهتمام',
          'هواية مستدامة وصديقة للبيئة'
        ],
        requirements: ['بذور أو نبتة صغيرة', 'كوب أو إناء', 'ماء نظيف', 'مكان بإضاءة جيدة'],
        apps: [
          { name: 'PlantNet', description: 'تحديد أنواع النباتات بالصور' },
          { name: 'Garden Timeline', description: 'تتبع نمو النباتات وجدولة الري' },
          { name: 'Moon & Garden', description: 'أفضل أوقات الزراعة حسب القمر' }
        ],
        websites: [
          { name: 'Garden.org', url: 'garden.org', description: 'دليل شامل للزراعة المنزلية' },
          { name: 'موقع زراعة', url: 'zira3a.net', description: 'معلومات عن الزراعة باللغة العربية' }
        ],
        tips: [
          'ابدأ بالنباتات السهلة مثل النعناع',
          'تأكد من وجود فتحات تصريف في الإناء',
          'اسق النبات عند جفاف التربة',
          'ضع النبات قرب النافذة للضوء',
          'سجل تقدم النمو بالصور'
        ]
      };
    } else if (category.includes('تعليم')) {
      return {
        benefits: [
          'توسيع المعرفة وتطوير الثقافة العامة',
          'تحسين التركيز ومهارات التحليل',
          'تطوير مهارات التفكير النقدي',
          'زيادة المفردات وتحسين اللغة',
          'فتح آفاق جديدة للتعلم'
        ],
        requirements: ['كتاب أو مصدر قراءة', 'مكان هادئ', 'وقت مخصص', 'دفتر ملاحظات'],
        apps: [
          { name: 'Kindle', description: 'مكتبة رقمية ضخمة للكتب' },
          { name: 'Audible', description: 'كتب صوتية للاستماع أثناء التنقل' },
          { name: 'Goodreads', description: 'تتبع قراءاتك واكتشاف كتب جديدة' }
        ],
        websites: [
          { name: 'مكتبة نور', url: 'noor-book.com', description: 'مكتبة عربية مجانية' },
          { name: 'Project Gutenberg', url: 'gutenberg.org', description: 'كتب كلاسيكية مجانية' },
          { name: 'أبجد', url: 'abjjad.com', description: 'منصة قراء عربية' }
        ],
        tips: [
          'حدد هدف قراءة يومي واقعي',
          'اختر مواضيع تهمك شخصياً',
          'خذ ملاحظات أثناء القراءة',
          'ناقش ما قرأته مع الآخرين',
          'نوع بين أنواع الكتب المختلفة'
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
        { name: 'YouTube', description: 'دروس تعليمية مجانية' },
        { name: 'Pinterest', description: 'أفكار وإلهام إبداعي' }
      ],
      websites: [
        { name: 'ويكيهاو', url: 'ar.wikihow.com', description: 'دليل خطوة بخطوة' }
      ],
      tips: [
        'ابدأ بخطوات بسيطة',
        'تدرب بانتظام',
        'لا تخف من الأخطاء',
        'استمتع بالعملية'
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