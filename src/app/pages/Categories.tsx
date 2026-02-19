import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import {
  UtensilsCrossed, Plane, Receipt, ShoppingBag,
  Film, Heart, GraduationCap, MoreHorizontal,
  Plus, Pencil, Trash2, X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const iconMap: Record<string, any> = {
  UtensilsCrossed, Plane, Receipt, ShoppingBag,
  Film, Heart, GraduationCap, MoreHorizontal,
};

const PRESET_ICONS = Object.keys(iconMap);
const PRESET_COLORS = [
  '#4F46E5', '#06b6d4', '#8b5cf6', '#f59e0b',
  '#10b981', '#ef4444', '#f97316', '#6366f1',
  '#ec4899', '#14b8a6',
];

interface CategoryFormState {
  name: string;
  icon: string;
  color: string;
}

export function Categories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryFormState>({ name: '', icon: 'UtensilsCrossed', color: '#4F46E5' });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', icon: 'UtensilsCrossed', color: '#4F46E5' });
    setShowModal(true);
  };

  const openEdit = (cat: typeof categories[0]) => {
    setEditId(cat.id);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    const result = editId
      ? await updateCategory(editId, form)
      : await addCategory(form);
    if (result.error) toast.error(result.error);
    else toast.success(editId ? 'Category updated!' : 'Category added!');
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This won't delete existing transactions.`)) return;
    const { error } = await deleteCategory(id);
    if (error) toast.error(error);
    else toast.success('Category deleted');
  };

  const total = categories.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Manage your expense categories.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="text-gray-400 py-12 text-center">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400 mb-4">No categories yet. Create your first one!</p>
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] ?? MoreHorizontal;
            return (
              <div
                key={category.id}
                className="bg-white rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(category)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500 mb-3">Total Spent</p>
                <p className="text-2xl font-semibold" style={{ color: category.color }}>
                  ${category.totalSpent.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {categories.map((category) => {
              const percentage = total > 0 ? (category.totalSpent / total) * 100 : 0;
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${category.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editId ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Food"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_ICONS.map(iconName => {
                    const Icon = iconMap[iconName];
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setForm({ ...form, icon: iconName })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-colors ${form.icon === iconName ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${form.color === color ? 'border-gray-900 scale-110' : 'border-transparent'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: form.color }}
                >
                  {(() => { const Icon = iconMap[form.icon] ?? MoreHorizontal; return <Icon className="w-5 h-5 text-white" />; })()}
                </div>
                <span className="font-medium text-gray-900">{form.name || 'Category Name'}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={saving}
              >
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Category'}
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
