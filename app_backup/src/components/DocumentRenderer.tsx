import { Fragment } from 'react'
import { MASTER_PAGES, DOC_FIELDS, type Block, type StudentRecord } from '@/lib/data'
import { cn } from '@/lib/utils'
import { TrinityLogo } from './DocumentEmblems'
import { DocumentFigure } from './DocumentFigures'

export interface DocumentCustomization {
  border: {
    enabled: boolean
    style: 'solid' | 'double' | 'classic' | 'thin' | 'none'
    width: number
    color: string
    inset: number
    applyTo: 'cover-cert' | 'all' | 'none'
  }
  logo: {
    enabled: boolean
    scale: number
    showTagline: boolean
  }
  header: {
    enabled: boolean
    text: string
    leftText: string
    showDivider: boolean
  }
  footer: {
    enabled: boolean
    leftText: string
    rightText: string
    showPageNum: boolean
  }
  figures: Record<string, {
    caption?: string
    border?: boolean
    scale?: number
  }>
}

export const DEFAULT_CUSTOMIZATION: DocumentCustomization = {
  border: {
    enabled: true,
    style: 'solid',
    width: 1.5,
    color: '#0f172a',
    inset: 16,
    applyTo: 'cover-cert',
  },
  logo: {
    enabled: true,
    scale: 1,
    showTagline: true,
  },
  header: {
    enabled: true,
    text: 'The Ultimate Smart Parking Token System',
    leftText: 'TAE, Pune',
    showDivider: true,
  },
  footer: {
    enabled: true,
    leftText: 'TAE, Pune',
    rightText: 'Depart of Information Technology',
    showPageNum: true,
  },
  figures: {},
}

export function resolveTokens(text: string, record: Partial<StudentRecord>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => (record as Record<string, string>)[k] ?? `{{${k}}}`)
}

export function fieldColor(key: string): string {
  return DOC_FIELDS.find((f) => f.key === key)?.color ?? '#6366f1'
}

function TokenText({
  text,
  record,
  onFieldClick,
  selectedField,
}: {
  text: string
  record: Partial<StudentRecord>
  onFieldClick?: (key: string) => void
  selectedField?: string | null
}) {
  const parts = text.split(/(\{\{\w+\}\})/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{\{(\w+)\}\}$/)
        if (!m) return <Fragment key={i}>{p}</Fragment>
        const key = m[1]
        const c = fieldColor(key)
        const selected = selectedField === key
        return (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              onFieldClick?.(key)
            }}
            title={`Semantic Field: ${DOC_FIELDS.find((f) => f.key === key)?.label ?? key} — Click to Edit`}
            className={cn(
              'inline-flex items-center rounded px-1 font-semibold transition-all',
              onFieldClick && 'cursor-pointer hover:scale-105 active:scale-95'
            )}
            style={{
              backgroundColor: selected ? c : `${c}22`,
              color: selected ? '#fff' : c,
              boxShadow: selected ? `0 0 0 2px ${c}66` : `inset 0 -1.5px 0 ${c}88`,
            }}
          >
            {(record as Record<string, string>)[key] ?? key}
          </button>
        )
      })}
    </>
  )
}

function BlockView({
  block,
  record,
  customization,
  onFieldClick,
  selectedField,
  onLogoClick,
  onFigureClick,
  onSignaturesClick,
  selectedElement,
}: {
  block: Block
  record: Partial<StudentRecord>
  customization: DocumentCustomization
  onFieldClick?: (k: string) => void
  selectedField?: string | null
  onLogoClick?: () => void
  onFigureClick?: (figureId: string) => void
  onSignaturesClick?: () => void
  selectedElement?: string | null
}) {
  const t = <TokenText text={'text' in block ? block.text : ''} record={record} onFieldClick={onFieldClick} selectedField={selectedField} />

  switch (block.type) {
    case 'h1':
      return <h1 className="mb-2 text-center text-[15px] font-extrabold uppercase tracking-wide text-slate-900">{t}</h1>
    case 'h2':
      return <h2 className="mb-1.5 mt-2 text-center text-[13px] font-bold uppercase tracking-wide text-slate-900">{t}</h2>
    case 'h3':
      return <h3 className="mb-1 mt-2 text-[11px] font-bold text-slate-900">{t}</h3>
    case 'p':
      return <p className="mb-2 text-justify text-[9.5px] leading-relaxed text-slate-800">{t}</p>
    case 'li':
      return <p className="mb-1 pl-2 text-[9px] leading-relaxed text-slate-700">{t}</p>
    case 'center':
      return <p className="mb-1 text-center text-[9.5px] font-medium leading-tight text-slate-800 whitespace-pre-line">{t}</p>
    case 'spacer':
      return <div className="h-3" />

    case 'logo':
      if (!customization.logo.enabled) return null
      return (
        <TrinityLogo
          scale={customization.logo.scale}
          showTagline={customization.logo.showTagline}
          onClick={onLogoClick}
          isSelected={selectedElement === 'logo'}
        />
      )

    case 'student_list':
      return (
        <div className="my-2 flex flex-col items-center justify-center">
          <table className="w-56 text-[9.5px] font-semibold text-slate-900">
            <tbody>
              {block.items.map((st, i) => (
                <tr key={i} className="leading-tight">
                  <td className="py-0.5 text-left">
                    <TokenText text={st.name} record={record} onFieldClick={onFieldClick} selectedField={selectedField} />
                  </td>
                  <td className="py-0.5 text-right font-mono font-bold text-slate-700">
                    <TokenText text={st.roll} record={record} onFieldClick={onFieldClick} selectedField={selectedField} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'signatures':
      return (
        <div
          onClick={(e) => {
            if (onSignaturesClick) {
              e.stopPropagation()
              onSignaturesClick()
            }
          }}
          className={cn(
            'group relative my-3 rounded-lg border border-transparent p-2 transition-all',
            onSignaturesClick && 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30',
            selectedElement === 'signatures' && 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-400'
          )}
        >
          <span className="pointer-events-none absolute -top-2.5 right-2 hidden rounded bg-indigo-600 px-1.5 py-0.5 text-[8.5px] font-semibold text-white shadow group-hover:block">
            ✍️ Signatures · Click to Edit
          </span>
          <div className="mb-4 flex justify-between text-[9px] text-slate-800">
            <div>Date: <TokenText text="{{date}}" record={record} onFieldClick={onFieldClick} selectedField={selectedField} /></div>
            <div>Place: <TokenText text="{{place}}" record={record} onFieldClick={onFieldClick} selectedField={selectedField} /></div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[8.5px]">
            {block.items.map((sig, i) => (
              <div key={i} className="flex flex-col justify-end pt-5">
                <div className="mx-auto mb-1 h-px w-3/4 bg-slate-400" />
                <div className="font-bold text-slate-900">
                  <TokenText text={sig.name} record={record} onFieldClick={onFieldClick} selectedField={selectedField} />
                </div>
                <div className="text-[7.5px] font-medium text-slate-600">{sig.title}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'figure':
      return (
        <DocumentFigure
          kind={block.kind}
          figNum={block.figNum}
          title={block.title}
          caption={block.caption}
          config={customization.figures[block.figureId]}
          onClick={() => onFigureClick?.(block.figureId)}
          isSelected={selectedElement === block.figureId}
        />
      )

    case 'reference_list':
      return (
        <div className="my-2 space-y-2 text-left text-[8.5px]">
          {block.items.map((ref) => (
            <div key={ref.num} className="flex gap-2 text-slate-800 leading-snug">
              <span className="font-bold text-slate-900">{ref.num}.</span>
              <div>
                <span>{ref.text}</span>
                {ref.link && (
                  <div className="font-mono text-[7.5px] text-indigo-600 underline">
                    {ref.link}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <table className="my-2 w-full border-collapse text-[9px]">
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className={cn('border border-slate-300 px-2 py-1', ri === 0 && 'bg-slate-100 font-semibold')}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
  }
}

export function DocumentPage({
  pageIndex,
  record,
  customization = DEFAULT_CUSTOMIZATION,
  onFieldClick,
  selectedField,
  onBorderClick,
  onLogoClick,
  onFigureClick,
  onHeaderClick,
  onFooterClick,
  onSignaturesClick,
  selectedElement,
  scale = 1,
}: {
  pageIndex: number
  record: Partial<StudentRecord>
  customization?: DocumentCustomization
  onFieldClick?: (key: string) => void
  selectedField?: string | null
  onBorderClick?: () => void
  onLogoClick?: () => void
  onFigureClick?: (figureId: string) => void
  onHeaderClick?: () => void
  onFooterClick?: () => void
  onSignaturesClick?: () => void
  selectedElement?: string | null
  scale?: number
}) {
  const page = MASTER_PAGES[Math.min(pageIndex, MASTER_PAGES.length - 1)]

  // Determine if this page should show the border frame
  const showBorder =
    customization.border.enabled &&
    (customization.border.applyTo === 'all' ||
      (customization.border.applyTo === 'cover-cert' && (page.page === 1 || page.page === 2)))

  const borderStyles: React.CSSProperties = showBorder
    ? {
        borderStyle: customization.border.style === 'double' ? 'double' : customization.border.style === 'none' ? 'none' : 'solid',
        borderWidth: customization.border.style === 'double' ? `${customization.border.width * 2}px` : `${customization.border.width}px`,
        borderColor: customization.border.color,
      }
    : {}

  return (
    <div
      className="doc-page relative mx-auto w-[520px] max-w-full shrink-0 rounded-sm bg-white shadow-lift"
      style={{
        aspectRatio: '595 / 842',
        padding: '30px 34px',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {/* ⬚ Outer Page Border Frame (Clickable & Editable) */}
      {showBorder && (
        <div
          onClick={(e) => {
            if (onBorderClick) {
              e.stopPropagation()
              onBorderClick()
            }
          }}
          className={cn(
            'group absolute pointer-events-auto transition-all',
            onBorderClick && 'cursor-pointer hover:ring-2 hover:ring-indigo-400',
            selectedElement === 'border' && 'ring-2 ring-indigo-600 bg-indigo-50/10'
          )}
          style={{
            top: `${customization.border.inset}px`,
            left: `${customization.border.inset}px`,
            right: `${customization.border.inset}px`,
            bottom: `${customization.border.inset}px`,
            ...borderStyles,
          }}
        >
          <span className="pointer-events-none absolute -top-3 left-4 hidden rounded bg-slate-900 px-1.5 py-0.5 text-[8.5px] font-semibold text-white shadow group-hover:block z-20">
            ⬚ Border Frame · Click to Edit Style
          </span>
        </div>
      )}

      {/* 📑 Running Header (Pages 3+) */}
      {page.page >= 3 && customization.header.enabled && (
        <div
          onClick={(e) => {
            if (onHeaderClick) {
              e.stopPropagation()
              onHeaderClick()
            }
          }}
          className={cn(
            'group relative mb-3 flex items-center justify-between border-b pb-1 text-[8.5px] text-slate-500 transition-all',
            customization.header.showDivider ? 'border-slate-300' : 'border-transparent',
            onHeaderClick && 'cursor-pointer hover:bg-indigo-50/50 rounded px-1',
            selectedElement === 'header' && 'bg-indigo-50 ring-1 ring-indigo-400 rounded px-1'
          )}
        >
          <span className="pointer-events-none absolute -top-3 left-2 hidden rounded bg-indigo-600 px-1 py-0.2 text-[8px] font-semibold text-white shadow group-hover:block z-20">
            📑 Header · Click to Edit
          </span>
          <span className="italic font-medium">{customization.header.leftText}</span>
          <span className="font-semibold text-slate-700">{customization.header.text}</span>
        </div>
      )}

      {/* Page Body Content Blocks */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {page.blocks.map((b, i) => (
            <BlockView
              key={i}
              block={b}
              record={record}
              customization={customization}
              onFieldClick={onFieldClick}
              selectedField={selectedField}
              onLogoClick={onLogoClick}
              onFigureClick={onFigureClick}
              onSignaturesClick={onSignaturesClick}
              selectedElement={selectedElement}
            />
          ))}
        </div>

        {/* 📑 Running Footer */}
        {customization.footer.enabled && (
          <div
            onClick={(e) => {
              if (onFooterClick) {
                e.stopPropagation()
                onFooterClick()
              }
            }}
            className={cn(
              'group relative mt-auto pt-2 flex items-center justify-between border-t border-slate-200 text-[8px] text-slate-500 transition-all',
              onFooterClick && 'cursor-pointer hover:bg-indigo-50/50 rounded px-1',
              selectedElement === 'footer' && 'bg-indigo-50 ring-1 ring-indigo-400 rounded px-1'
            )}
          >
            <span className="pointer-events-none absolute -top-3 right-2 hidden rounded bg-indigo-600 px-1 py-0.2 text-[8px] font-semibold text-white shadow group-hover:block z-20">
              📑 Footer · Click to Edit
            </span>
            <span>{customization.footer.leftText}</span>
            {customization.footer.showPageNum && (
              <span className="font-mono text-slate-400">Page {page.page} of {MASTER_PAGES.length}</span>
            )}
            <span>{customization.footer.rightText}</span>
          </div>
        )}
      </div>
    </div>
  )
}
