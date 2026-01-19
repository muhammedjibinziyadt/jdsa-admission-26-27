import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  GripVertical,
  BookOpen,
  Mic,
  PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface TrainingSubject {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subjects: TrainingSubject[];
  enabled: boolean;
  order: number;
}

interface TrainingCategoriesEditorProps {
  categories: TrainingCategory[];
  onSave: (categories: TrainingCategory[]) => Promise<void>;
  saving?: boolean;
}

const defaultCategories: TrainingCategory[] = [
  {
    id: 'speech-training',
    name: 'പ്രസംഗ പരിശീലനം',
    description: 'ആത്മവിശ്വാസത്തോടെ പ്രസംഗിക്കാൻ പഠിക്കാം',
    icon: 'Mic',
    enabled: true,
    order: 1,
    subjects: [
      { id: 'speech-1', title: 'അറബി പ്രസംഗം', description: 'അറബി ഭാഷയിൽ പ്രസംഗം', order: 1 },
      { id: 'speech-2', title: 'മലയാളം പ്രസംഗം', description: 'മലയാളത്തിൽ പ്രസംഗം', order: 2 },
      { id: 'speech-3', title: 'ഇംഗ്ലീഷ് പ്രസംഗം', description: 'ഇംഗ്ലീഷ് ഭാഷയിൽ പ്രസംഗം', order: 3 },
    ]
  },
  {
    id: 'writing-training',
    name: 'എഴുത്ത് പരിശീലനം',
    description: 'മനോഹരമായ കൈയെഴുത്ത് കഴിവുകൾ',
    icon: 'PenTool',
    enabled: true,
    order: 2,
    subjects: [
      { id: 'writing-1', title: 'അറബി എഴുത്ത്', description: 'അറബി കാലിഗ്രഫി', order: 1 },
      { id: 'writing-2', title: 'മലയാളം എഴുത്ത്', description: 'മലയാളം കൈയെഴുത്ത്', order: 2 },
      { id: 'writing-3', title: 'ഇംഗ്ലീഷ് എഴുത്ത്', description: 'ഇംഗ്ലീഷ് കൈയെഴുത്ത്', order: 3 },
    ]
  }
];

const iconOptions = [
  { value: 'Mic', label: 'മൈക്ക്', icon: Mic },
  { value: 'PenTool', label: 'പേന', icon: PenTool },
  { value: 'BookOpen', label: 'പുസ്തകം', icon: BookOpen },
];

export default function TrainingCategoriesEditor({ 
  categories: initialCategories, 
  onSave, 
  saving 
}: TrainingCategoriesEditorProps) {
  const [categories, setCategories] = useState<TrainingCategory[]>(
    initialCategories?.length > 0 ? initialCategories : defaultCategories
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<{ categoryId: string; subjectId: string } | null>(null);
  const [tempCategory, setTempCategory] = useState<TrainingCategory | null>(null);
  const [tempSubject, setTempSubject] = useState<TrainingSubject | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveAll = async () => {
    await onSave(categories);
    setHasChanges(false);
  };

  // Category handlers
  const handleAddCategory = () => {
    const newCategory: TrainingCategory = {
      id: `category-${Date.now()}`,
      name: 'പുതിയ കാറ്റഗറി',
      description: 'വിവരണം ചേർക്കുക',
      icon: 'BookOpen',
      enabled: true,
      order: categories.length + 1,
      subjects: []
    };
    setCategories([...categories, newCategory]);
    setEditingCategory(newCategory.id);
    setTempCategory(newCategory);
    setHasChanges(true);
  };

  const handleEditCategory = (category: TrainingCategory) => {
    setEditingCategory(category.id);
    setTempCategory({ ...category });
  };

  const handleSaveCategory = () => {
    if (!tempCategory) return;
    setCategories(categories.map(c => c.id === tempCategory.id ? tempCategory : c));
    setEditingCategory(null);
    setTempCategory(null);
    setHasChanges(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    setHasChanges(true);
  };

  const handleToggleCategory = (categoryId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, enabled: !c.enabled } : c
    ));
    setHasChanges(true);
  };

  // Subject handlers
  const handleAddSubject = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newSubject: TrainingSubject = {
      id: `subject-${Date.now()}`,
      title: 'പുതിയ സബ്ജക്ട്',
      description: 'വിവരണം',
      order: category.subjects.length + 1
    };

    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, subjects: [...c.subjects, newSubject] }
        : c
    ));
    setEditingSubject({ categoryId, subjectId: newSubject.id });
    setTempSubject(newSubject);
    setHasChanges(true);
  };

  const handleEditSubject = (categoryId: string, subject: TrainingSubject) => {
    setEditingSubject({ categoryId, subjectId: subject.id });
    setTempSubject({ ...subject });
  };

  const handleSaveSubject = () => {
    if (!editingSubject || !tempSubject) return;
    
    setCategories(categories.map(c => 
      c.id === editingSubject.categoryId 
        ? { 
            ...c, 
            subjects: c.subjects.map(s => 
              s.id === tempSubject.id ? tempSubject : s
            )
          }
        : c
    ));
    setEditingSubject(null);
    setTempSubject(null);
    setHasChanges(true);
  };

  const handleDeleteSubject = (categoryId: string, subjectId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, subjects: c.subjects.filter(s => s.id !== subjectId) }
        : c
    ));
    setHasChanges(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(i => i.value === iconName);
    return iconOption?.icon || BookOpen;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            പരിശീലന കാറ്റഗറികൾ
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            പ്രസംഗം, എഴുത്ത് പരിശീലനം തുടങ്ങിയ കാറ്റഗറികളും അവയിലെ സബ്ജക്ടുകളും മാനേജ് ചെയ്യുക
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddCategory} variant="outline" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            കാറ്റഗറി ചേർക്കുക
          </Button>
          {hasChanges && (
            <Button onClick={handleSaveAll} disabled={saving} className="rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'സേവ് ചെയ്യുന്നു...' : 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          
          return (
            <Card key={category.id} className={`border-2 ${!category.enabled ? 'opacity-60 border-dashed' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    {editingCategory === category.id && tempCategory ? (
                      <div className="space-y-2">
                        <Input
                          value={tempCategory.name}
                          onChange={(e) => setTempCategory({ ...tempCategory, name: e.target.value })}
                          placeholder="കാറ്റഗറി പേര്"
                          className="font-semibold"
                        />
                        <Input
                          value={tempCategory.description}
                          onChange={(e) => setTempCategory({ ...tempCategory, description: e.target.value })}
                          placeholder="വിവരണം"
                          className="text-sm"
                        />
                        <select
                          value={tempCategory.icon}
                          onChange={(e) => setTempCategory({ ...tempCategory, icon: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        >
                          {iconOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveCategory}>
                            <Save className="w-4 h-4 mr-1" />
                            സേവ്
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => { setEditingCategory(null); setTempCategory(null); }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            റദ്ദാക്കുക
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {category.name}
                          {!category.enabled && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">നിർജ്ജീവം</span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {editingCategory !== category.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleCategory(category.id)}
                        title={category.enabled ? 'നിർജ്ജീവമാക്കുക' : 'സജീവമാക്കുക'}
                      >
                        {category.enabled ? (
                          <ChevronUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>കാറ്റഗറി നീക്കം ചെയ്യണോ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{category.name}" എന്ന കാറ്റഗറിയും അതിലെ എല്ലാ സബ്ജക്ടുകളും നീക്കം ചെയ്യപ്പെടും.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>റദ്ദാക്കുക</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              നീക്കം ചെയ്യുക
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      സബ്ജക്ടുകൾ ({category.subjects.length})
                    </h4>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddSubject(category.id)}
                      className="rounded-lg"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      സബ്ജക്ട് ചേർക്കുക
                    </Button>
                  </div>

                  {category.subjects.length === 0 ? (
                    <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">
                        സബ്ജക്ടുകൾ ചേർക്കപ്പെട്ടിട്ടില്ല
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {category.subjects.map((subject) => (
                        <div 
                          key={subject.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          
                          {editingSubject?.categoryId === category.id && 
                           editingSubject?.subjectId === subject.id && 
                           tempSubject ? (
                            <div className="flex-1 space-y-2">
                              <Input
                                value={tempSubject.title}
                                onChange={(e) => setTempSubject({ ...tempSubject, title: e.target.value })}
                                placeholder="സബ്ജക്ട് പേര്"
                              />
                              <Textarea
                                value={tempSubject.description}
                                onChange={(e) => setTempSubject({ ...tempSubject, description: e.target.value })}
                                placeholder="വിവരണം"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveSubject}>
                                  <Save className="w-4 h-4 mr-1" />
                                  സേവ്
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => { setEditingSubject(null); setTempSubject(null); }}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  റദ്ദാക്കുക
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{subject.title}</p>
                                <p className="text-xs text-muted-foreground">{subject.description}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditSubject(category.id, subject)}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>സബ്ജക്ട് നീക്കം ചെയ്യണോ?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        "{subject.title}" എന്ന സബ്ജക്ട് നീക്കം ചെയ്യപ്പെടും.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>റദ്ദാക്കുക</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSubject(category.id, subject.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        നീക്കം ചെയ്യുക
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              കാറ്റഗറികൾ ചേർക്കപ്പെട്ടിട്ടില്ല
            </p>
            <Button onClick={handleAddCategory} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              ആദ്യത്തെ കാറ്റഗറി ചേർക്കുക
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { defaultCategories };
