import { useState } from "react";
import { 
  Plus, 
  Save, 
  X, 
  Trash2, 
  Edit3, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  BookOpenCheck,
  BookText,
  Monitor,
  PenTool,
  Mic,
  Library,
  Coffee,
  GraduationCap,
  Users,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WebsiteContent } from "@/hooks/useWebsiteContent";

interface LearningItem {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  order: number;
  content: string[];
}

interface LearningItemsEditorProps {
  localContent: WebsiteContent;
  setLocalContent: (content: WebsiteContent) => void;
  handleSaveToDatabase: (content: WebsiteContent) => Promise<void>;
  saving: boolean;
  renderFieldEditor: (
    field: string,
    label: string,
    value: string,
    onSave: () => Promise<void>,
    isTextArea?: boolean
  ) => React.ReactNode;
  tempValue: string;
}

// Icon options for selection
const iconOptions = [
  { value: 'Mic', label: 'മൈക്', icon: Mic },
  { value: 'Users', label: 'ഉപയോക്താക്കൾ', icon: Users },
  { value: 'PenTool', label: 'പേന', icon: PenTool },
  { value: 'MessageSquare', label: 'സന്ദേശം', icon: MessageSquare },
  { value: 'Library', label: 'ലൈബ്രറി', icon: Library },
  { value: 'Coffee', label: 'കോഫി', icon: Coffee },
  { value: 'BookOpenCheck', label: 'പുസ്തകം', icon: BookOpenCheck },
  { value: 'BookText', label: 'പാഠപുസ്തകം', icon: BookText },
  { value: 'Monitor', label: 'മോണിറ്റർ', icon: Monitor },
  { value: 'GraduationCap', label: 'ഗ്രാജുവേഷൻ', icon: GraduationCap }
];

const LearningItemsEditor = ({
  localContent,
  setLocalContent,
  handleSaveToDatabase,
  saving,
  renderFieldEditor,
  tempValue
}: LearningItemsEditorProps) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempItem, setTempItem] = useState<LearningItem | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const learningItems = localContent.learningItems || [];

  // Sort by order
  const sortedItems = [...learningItems].sort((a, b) => a.order - b.order);

  const handleEditItem = (item: LearningItem) => {
    setEditingItem(item.id);
    setTempItem({ ...item });
  };

  const handleSaveItem = async () => {
    if (!tempItem) return;
    const updatedItems = learningItems.map(item => 
      item.id === tempItem.id ? tempItem : item
    );
    const updatedContent = { ...localContent, learningItems: updatedItems };
    setLocalContent(updatedContent);
    setEditingItem(null);
    setTempItem(null);
    await handleSaveToDatabase(updatedContent);
  };

  const handleDeleteItem = async (id: string) => {
    const updatedItems = learningItems.filter(item => item.id !== id);
    // Re-order remaining items
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    const updatedContent = { ...localContent, learningItems: reorderedItems };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleAddItem = async () => {
    const newId = String(Date.now());
    const newItem: LearningItem = {
      id: newId,
      title: 'പുതിയ വിഭാഗം',
      icon: 'BookOpenCheck',
      enabled: true,
      order: learningItems.length + 1,
      content: ['പുതിയ ഇനം 1', 'പുതിയ ഇനം 2']
    };
    const updatedContent = { 
      ...localContent, 
      learningItems: [...learningItems, newItem] 
    };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    const updatedItems = learningItems.map(item => 
      item.id === id ? { ...item, enabled } : item
    );
    const updatedContent = { ...localContent, learningItems: updatedItems };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sortedItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === sortedItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newSortedItems = [...sortedItems];
    [newSortedItems[currentIndex], newSortedItems[newIndex]] = 
    [newSortedItems[newIndex], newSortedItems[currentIndex]];

    const reorderedItems = newSortedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    const updatedContent = { ...localContent, learningItems: reorderedItems };
    setLocalContent(updatedContent);
    await handleSaveToDatabase(updatedContent);
  };

  const handleAddContentItem = () => {
    if (!tempItem) return;
    setTempItem({
      ...tempItem,
      content: [...tempItem.content, 'പുതിയ ഇനം']
    });
  };

  const handleUpdateContentItem = (index: number, value: string) => {
    if (!tempItem) return;
    const newContent = [...tempItem.content];
    newContent[index] = value;
    setTempItem({ ...tempItem, content: newContent });
  };

  const handleRemoveContentItem = (index: number) => {
    if (!tempItem || tempItem.content.length <= 1) return;
    const newContent = tempItem.content.filter((_, i) => i !== index);
    setTempItem({ ...tempItem, content: newContent });
  };

  const SelectedIcon = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || BookOpenCheck;
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">പഠന പാഠ്യന്തര വിഭാഗങ്ങൾ</h2>
      
      {/* Section Settings */}
      <div className="space-y-4 mb-8">
        <h3 className="font-display text-lg font-semibold text-foreground">സെക്ഷൻ സെറ്റിംഗ്സ്</h3>
        {renderFieldEditor(
          "coursesSection.title", 
          "സെക്ഷൻ ടൈറ്റിൽ", 
          localContent.coursesSection?.title || 'പഠന പാഠ്യന്തര വിഷയങ്ങൾ', 
          async () => {
            const updatedContent = {
              ...localContent,
              coursesSection: { 
                ...localContent.coursesSection, 
                title: tempValue 
              }
            };
            setLocalContent(updatedContent);
            await handleSaveToDatabase(updatedContent);
          }
        )}
        {renderFieldEditor(
          "coursesSection.subtitle", 
          "സെക്ഷൻ സബ്‌ടൈറ്റിൽ (ബാഡ്ജ്)", 
          localContent.coursesSection?.subtitle || 'പഠന പദ്ധതികൾ', 
          async () => {
            const updatedContent = {
              ...localContent,
              coursesSection: { 
                ...localContent.coursesSection, 
                subtitle: tempValue 
              }
            };
            setLocalContent(updatedContent);
            await handleSaveToDatabase(updatedContent);
          }
        )}
        {renderFieldEditor(
          "coursesSection.description", 
          "സെക്ഷൻ വിവരണം", 
          localContent.coursesSection?.description || 'സമഗ്രമായ വിദ്യാഭ്യാസ പദ്ധതിയിലൂടെ വിദ്യാർത്ഥികളെ എല്ലാ മേഖലകളിലും മികവുറ്റവരാക്കുന്നു', 
          async () => {
            const updatedContent = {
              ...localContent,
              coursesSection: { 
                ...localContent.coursesSection, 
                description: tempValue 
              }
            };
            setLocalContent(updatedContent);
            await handleSaveToDatabase(updatedContent);
          },
          true
        )}
      </div>

      {/* Learning Items List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold text-foreground">വിഭാഗങ്ങൾ</h3>
          <Button onClick={handleAddItem} className="rounded-xl" disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />പുതിയ വിഭാഗം
          </Button>
        </div>

        <div className="space-y-4">
          {sortedItems.map((item, index) => {
            const IconComponent = SelectedIcon(item.icon);
            const isEditing = editingItem === item.id;
            const isExpanded = expandedItem === item.id;

            return (
              <div 
                key={item.id} 
                className={`bg-card rounded-2xl border transition-all duration-200 ${
                  item.enabled 
                    ? 'border-border/50 shadow-soft' 
                    : 'border-border/30 opacity-60'
                }`}
              >
                {isEditing && tempItem ? (
                  // Edit Mode
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg">എഡിറ്റ് ചെയ്യുക</h4>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">
                        ടൈറ്റിൽ
                      </label>
                      <input
                        type="text"
                        value={tempItem.title}
                        onChange={(e) => setTempItem({ ...tempItem, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background"
                        placeholder="വിഭാഗത്തിന്റെ പേര്"
                      />
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">
                        ഐക്കൺ
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {iconOptions.map((option) => {
                          const IconOpt = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setTempItem({ ...tempItem, icon: option.value })}
                              className={`p-3 rounded-xl border transition-all ${
                                tempItem.icon === option.value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              title={option.label}
                            >
                              <IconOpt className="w-5 h-5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Content Items */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          ഉള്ളടക്ക ഇനങ്ങൾ
                        </label>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleAddContentItem}
                          className="rounded-lg"
                        >
                          <Plus className="w-3 h-3 mr-1" />ഇനം
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {tempItem.content.map((contentItem, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
                            <input
                              type="text"
                              value={contentItem}
                              onChange={(e) => handleUpdateContentItem(idx, e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                              placeholder={`ഇനം ${idx + 1}`}
                            />
                            {tempItem.content.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveContentItem(idx)}
                                className="text-destructive p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm" 
                        onClick={handleSaveItem} 
                        className="rounded-lg" 
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        സേവ്
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => { setEditingItem(null); setTempItem(null); }} 
                        className="rounded-lg"
                      >
                        <X className="w-4 h-4 mr-1" />റദ്ദാക്കുക
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveItem(item.id, 'up')}
                            disabled={index === 0 || saving}
                            className="p-1 h-6"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveItem(item.id, 'down')}
                            disabled={index === sortedItems.length - 1 || saving}
                            className="p-1 h-6"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Item Info */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            item.enabled ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              item.enabled ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {item.content.length} ഇനങ്ങൾ
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Enable/Disable Toggle */}
                        <div className="flex items-center gap-2 px-3">
                          {item.enabled ? (
                            <Eye className="w-4 h-4 text-primary" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Switch
                            checked={item.enabled}
                            onCheckedChange={(checked) => handleToggleEnabled(item.id, checked)}
                            disabled={saving}
                          />
                        </div>

                        {/* Preview Toggle */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>

                        {/* Edit */}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>

                        {/* Delete */}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive" 
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content Preview */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <ul className="space-y-2 pl-16">
                          {item.content.map((contentItem, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {contentItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>വിഭാഗങ്ങൾ ഒന്നും ഇല്ല</p>
            <Button onClick={handleAddItem} className="mt-4 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />ആദ്യത്തെ വിഭാഗം ചേർക്കുക
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningItemsEditor;