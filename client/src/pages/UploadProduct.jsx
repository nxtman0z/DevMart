import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';
import { productAPI } from '../api/endpoints';
import { formatCurrency, getCategoryColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const categories = ['UI Kit', 'Template', 'Boilerplate', 'Snippet', 'Tool'];

export default function UploadProduct() {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [productFile, setProductFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', price: '', category: 'UI Kit', tags: '' },
  });

  const watchedValues = watch();

  const imageDropzone = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 4,
    onDrop: (files) => {
      const newImages = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
      setPreviewImages((prev) => [...prev, ...newImages].slice(0, 4));
    },
  });

  const fileDropzone = useDropzone({
    accept: { 'application/zip': ['.zip'], 'application/x-rar-compressed': ['.rar'] },
    maxFiles: 1,
    onDrop: (files) => setProductFile(files[0]),
  });

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (previewImages.length === 0) {
      toast.error('Please add at least one preview image');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('tags', data.tags);
      previewImages.forEach((img) => formData.append('previewImages', img.file));
      if (productFile) formData.append('productFile', productFile);

      await productAPI.create(formData);
      toast.success('Product uploaded successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in">
      <h1 className="text-3xl font-bold mb-8">Upload Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="glass-card p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input className="input-field" placeholder="Product title" {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="input-field min-h-[120px] resize-none" placeholder="Describe your product..." {...register('description', { required: 'Description is required' })} />
                {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Price (₹)</label>
                  <input type="number" className="input-field" placeholder="499" min="0" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })} />
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <select className="input-field" {...register('category')}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Tags (comma separated)</label>
                <input className="input-field" placeholder="react, tailwind, dashboard" {...register('tags')} />
              </div>
            </div>

            {/* Preview Images */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium mb-3">Preview Images (max 4)</label>
              <div {...imageDropzone.getRootProps()} className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <input {...imageDropzone.getInputProps()} />
                <HiPhotograph className="text-3xl text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">Drag & drop images or click to browse</p>
              </div>
              {previewImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {previewImages.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden aspect-video group">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <HiX className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product File */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium mb-3">Product File (ZIP)</label>
              <div {...fileDropzone.getRootProps()} className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <input {...fileDropzone.getInputProps()} />
                <HiUpload className="text-3xl text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">{productFile ? productFile.name : 'Drag & drop ZIP file or click to browse'}</p>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? 'Uploading...' : 'Publish Product'}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Live Preview</h3>
            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="h-40 bg-dark-bg flex items-center justify-center">
                {previewImages.length > 0 ? (
                  <img src={previewImages[0].preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <HiPhotograph className="text-4xl text-dark-border" />
                )}
              </div>
              <div className="p-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getCategoryColor(watchedValues.category)}`}>
                  {watchedValues.category}
                </span>
                <h4 className="font-semibold text-sm mb-1">{watchedValues.title || 'Product Title'}</h4>
                <p className="text-xs text-muted line-clamp-2 mb-3">{watchedValues.description || 'Product description...'}</p>
                <p className="text-lg font-bold text-primary">{watchedValues.price ? formatCurrency(Number(watchedValues.price)) : '₹0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
