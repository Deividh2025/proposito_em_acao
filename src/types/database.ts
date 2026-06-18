export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          admin_deletion_allowed: boolean
          confirmation_phrase_matched: boolean
          created_at: string
          id: string
          processing_restriction: string
          reason: string | null
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_deletion_allowed?: boolean
          confirmation_phrase_matched?: boolean
          created_at?: string
          id?: string
          processing_restriction?: string
          reason?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_deletion_allowed?: boolean
          confirmation_phrase_matched?: boolean
          created_at?: string
          id?: string
          processing_restriction?: string
          reason?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      accountability_events: {
        Row: {
          accountability_grant_id: string | null
          accountability_partner_id: string | null
          actor_id: string | null
          actor_type: string
          created_at: string
          event_type: string
          goal_id: string | null
          id: string
          metadata_minimal: Json
          user_id: string
        }
        Insert: {
          accountability_grant_id?: string | null
          accountability_partner_id?: string | null
          actor_id?: string | null
          actor_type: string
          created_at?: string
          event_type: string
          goal_id?: string | null
          id?: string
          metadata_minimal?: Json
          user_id: string
        }
        Update: {
          accountability_grant_id?: string | null
          accountability_partner_id?: string | null
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          event_type?: string
          goal_id?: string | null
          id?: string
          metadata_minimal?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_events_accountability_grant_id_user_id_fkey"
            columns: ["accountability_grant_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accountability_grants"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "accountability_events_accountability_partner_id_user_id_fkey"
            columns: ["accountability_partner_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accountability_partners"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "accountability_events_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      accountability_grants: {
        Row: {
          accepted_at: string | null
          accountability_partner_id: string
          consent_recorded_at: string | null
          consent_version: string
          created_at: string
          expires_at: string | null
          goal_id: string
          id: string
          invite_token_hash: string | null
          last_previewed_at: string | null
          notification_frequency: string
          permissions: Json
          revoked_at: string | null
          revoked_reason: string | null
          sharing_permissions: Json
          status: string
          tracking_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          accountability_partner_id: string
          consent_recorded_at?: string | null
          consent_version?: string
          created_at?: string
          expires_at?: string | null
          goal_id: string
          id?: string
          invite_token_hash?: string | null
          last_previewed_at?: string | null
          notification_frequency?: string
          permissions?: Json
          revoked_at?: string | null
          revoked_reason?: string | null
          sharing_permissions?: Json
          status?: string
          tracking_level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          accountability_partner_id?: string
          consent_recorded_at?: string | null
          consent_version?: string
          created_at?: string
          expires_at?: string | null
          goal_id?: string
          id?: string
          invite_token_hash?: string | null
          last_previewed_at?: string | null
          notification_frequency?: string
          permissions?: Json
          revoked_at?: string | null
          revoked_reason?: string | null
          sharing_permissions?: Json
          status?: string
          tracking_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_grants_accountability_partner_id_user_id_fkey"
            columns: ["accountability_partner_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accountability_partners"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "accountability_grants_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      accountability_notifications: {
        Row: {
          accountability_grant_id: string
          accountability_partner_id: string
          approved_at: string | null
          blocked_reason: string | null
          channel: string
          created_at: string
          goal_id: string
          id: string
          notification_type: string
          preview_payload: Json
          privacy_check: Json
          provider_status: string
          scheduled_for: string | null
          sent_at: string | null
          sent_payload_redacted: Json
          status: string
          template_key: string | null
          template_version: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accountability_grant_id: string
          accountability_partner_id: string
          approved_at?: string | null
          blocked_reason?: string | null
          channel?: string
          created_at?: string
          goal_id: string
          id?: string
          notification_type: string
          preview_payload?: Json
          privacy_check?: Json
          provider_status?: string
          scheduled_for?: string | null
          sent_at?: string | null
          sent_payload_redacted?: Json
          status?: string
          template_key?: string | null
          template_version?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accountability_grant_id?: string
          accountability_partner_id?: string
          approved_at?: string | null
          blocked_reason?: string | null
          channel?: string
          created_at?: string
          goal_id?: string
          id?: string
          notification_type?: string
          preview_payload?: Json
          privacy_check?: Json
          provider_status?: string
          scheduled_for?: string | null
          sent_at?: string | null
          sent_payload_redacted?: Json
          status?: string
          template_key?: string | null
          template_version?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_notifications_accountability_grant_id_user__fkey"
            columns: ["accountability_grant_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accountability_grants"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "accountability_notifications_accountability_partner_id_use_fkey"
            columns: ["accountability_partner_id", "user_id"]
            isOneToOne: false
            referencedRelation: "accountability_partners"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "accountability_notifications_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      accountability_partners: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string | null
          id: string
          invite_expires_at: string | null
          invite_token_hash: string | null
          invited_at: string
          last_invite_previewed_at: string | null
          name: string
          partner_user_id: string | null
          relationship_label: string | null
          revoked_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          invite_expires_at?: string | null
          invite_token_hash?: string | null
          invited_at?: string
          last_invite_previewed_at?: string | null
          name: string
          partner_user_id?: string | null
          relationship_label?: string | null
          revoked_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          invite_expires_at?: string | null
          invite_token_hash?: string | null
          invited_at?: string
          last_invite_previewed_at?: string | null
          name?: string
          partner_user_id?: string | null
          relationship_label?: string | null
          revoked_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      action_unblock_sessions: {
        Row: {
          ai_plan: Json
          calendar_block_id: string | null
          confidence_level: string | null
          created_at: string
          crisis_flag: boolean
          energy: string | null
          first_step: string | null
          human_help_recommended: boolean
          id: string
          inbox_item_id: string | null
          minimum_viable_action: string | null
          next_route: string | null
          obstacle: string | null
          obstacle_key: string | null
          obstacle_type: string | null
          reason_to_suggest_metacognition: string | null
          recommended_focus_minutes: number | null
          related_goal_id: string | null
          related_project_id: string | null
          safety_note: string | null
          schema_version: string
          started_focus: boolean
          state: string | null
          suggest_metacognition: boolean
          task_id: string | null
          time_available_minutes: number | null
          updated_at: string
          user_id: string
          user_review_required: boolean
        }
        Insert: {
          ai_plan?: Json
          calendar_block_id?: string | null
          confidence_level?: string | null
          created_at?: string
          crisis_flag?: boolean
          energy?: string | null
          first_step?: string | null
          human_help_recommended?: boolean
          id?: string
          inbox_item_id?: string | null
          minimum_viable_action?: string | null
          next_route?: string | null
          obstacle?: string | null
          obstacle_key?: string | null
          obstacle_type?: string | null
          reason_to_suggest_metacognition?: string | null
          recommended_focus_minutes?: number | null
          related_goal_id?: string | null
          related_project_id?: string | null
          safety_note?: string | null
          schema_version?: string
          started_focus?: boolean
          state?: string | null
          suggest_metacognition?: boolean
          task_id?: string | null
          time_available_minutes?: number | null
          updated_at?: string
          user_id: string
          user_review_required?: boolean
        }
        Update: {
          ai_plan?: Json
          calendar_block_id?: string | null
          confidence_level?: string | null
          created_at?: string
          crisis_flag?: boolean
          energy?: string | null
          first_step?: string | null
          human_help_recommended?: boolean
          id?: string
          inbox_item_id?: string | null
          minimum_viable_action?: string | null
          next_route?: string | null
          obstacle?: string | null
          obstacle_key?: string | null
          obstacle_type?: string | null
          reason_to_suggest_metacognition?: string | null
          recommended_focus_minutes?: number | null
          related_goal_id?: string | null
          related_project_id?: string | null
          safety_note?: string | null
          schema_version?: string
          started_focus?: boolean
          state?: string | null
          suggest_metacognition?: boolean
          task_id?: string | null
          time_available_minutes?: number | null
          updated_at?: string
          user_id?: string
          user_review_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "action_unblock_sessions_calendar_block_user_fk"
            columns: ["calendar_block_id", "user_id"]
            isOneToOne: false
            referencedRelation: "calendar_blocks"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "action_unblock_sessions_goal_user_fk"
            columns: ["related_goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "action_unblock_sessions_inbox_item_user_fk"
            columns: ["inbox_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "inbox_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "action_unblock_sessions_project_user_fk"
            columns: ["related_project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "action_unblock_sessions_task_id_user_id_fkey"
            columns: ["task_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      ai_run_audits: {
        Row: {
          agent_name: string
          created_at: string
          error_code: string | null
          expires_at: string
          guardrail_status: string
          id: string
          latency_ms: number | null
          metadata_minimal: Json
          schema_name: string
          schema_version: string
          status: string
          user_id: string | null
        }
        Insert: {
          agent_name: string
          created_at?: string
          error_code?: string | null
          expires_at?: string
          guardrail_status: string
          id?: string
          latency_ms?: number | null
          metadata_minimal?: Json
          schema_name: string
          schema_version: string
          status: string
          user_id?: string | null
        }
        Update: {
          agent_name?: string
          created_at?: string
          error_code?: string | null
          expires_at?: string
          guardrail_status?: string
          id?: string
          latency_ms?: number | null
          metadata_minimal?: Json
          schema_name?: string
          schema_version?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          actor_id: string | null
          actor_type: string
          created_at: string
          event_type: string
          id: string
          metadata_minimal: Json
          resource_id: string | null
          resource_type: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          event_type: string
          id?: string
          metadata_minimal?: Json
          resource_id?: string | null
          resource_type?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata_minimal?: Json
          resource_id?: string | null
          resource_type?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      beta_feedback_items: {
        Row: {
          blocked: string
          clarity_score: number
          comment: string | null
          confused: string
          consent_version: string
          created_at: string
          expires_at: string
          friction_score: number
          has_sensitive_hint: boolean
          id: string
          module: string
          status: string
          submitted_at: string
          usefulness_score: number
          user_id: string
          worked: string
        }
        Insert: {
          blocked: string
          clarity_score: number
          comment?: string | null
          confused: string
          consent_version: string
          created_at?: string
          expires_at?: string
          friction_score: number
          has_sensitive_hint?: boolean
          id?: string
          module: string
          status?: string
          submitted_at?: string
          usefulness_score: number
          user_id: string
          worked: string
        }
        Update: {
          blocked?: string
          clarity_score?: number
          comment?: string | null
          confused?: string
          consent_version?: string
          created_at?: string
          expires_at?: string
          friction_score?: number
          has_sensitive_hint?: boolean
          id?: string
          module?: string
          status?: string
          submitted_at?: string
          usefulness_score?: number
          user_id?: string
          worked?: string
        }
        Relationships: []
      }
      calendar_blocks: {
        Row: {
          block_type: string
          created_at: string
          end_time: string
          energy_level: string | null
          habit_id: string | null
          id: string
          notes: string | null
          recurrence_parent_id: string | null
          recurrence_rule: string | null
          start_time: string
          status: string
          task_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_type?: string
          created_at?: string
          end_time: string
          energy_level?: string | null
          habit_id?: string | null
          id?: string
          notes?: string | null
          recurrence_parent_id?: string | null
          recurrence_rule?: string | null
          start_time: string
          status?: string
          task_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block_type?: string
          created_at?: string
          end_time?: string
          energy_level?: string | null
          habit_id?: string | null
          id?: string
          notes?: string | null
          recurrence_parent_id?: string | null
          recurrence_rule?: string | null
          start_time?: string
          status?: string
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_blocks_habit_user_fk"
            columns: ["habit_id", "user_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "calendar_blocks_recurrence_parent_fk"
            columns: ["recurrence_parent_id", "user_id"]
            isOneToOne: false
            referencedRelation: "calendar_blocks"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "calendar_blocks_task_id_user_id_fkey"
            columns: ["task_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      calling_session_entries: {
        Row: {
          ai_reflection: string | null
          answer: string | null
          calling_id: string
          created_at: string
          id: string
          position: number
          prompt_key: string
          prompt_version: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_reflection?: string | null
          answer?: string | null
          calling_id: string
          created_at?: string
          id?: string
          position?: number
          prompt_key: string
          prompt_version?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_reflection?: string | null
          answer?: string | null
          calling_id?: string
          created_at?: string
          id?: string
          position?: number
          prompt_key?: string
          prompt_version?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calling_session_entries_calling_id_user_id_fkey"
            columns: ["calling_id", "user_id"]
            isOneToOne: false
            referencedRelation: "callings"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      callings: {
        Row: {
          accepted_at: string | null
          burdens: Json
          confidence_level: string
          contribution: string | null
          created_at: string
          gifts: Json
          guardrail_status: string
          hypothesis: string | null
          id: string
          pastoral_safety_note: string | null
          people_to_serve: string | null
          privacy_level: string
          reviewed_at: string | null
          schema_version: string
          statement: string | null
          status: string
          updated_at: string
          user_id: string
          values: Json
        }
        Insert: {
          accepted_at?: string | null
          burdens?: Json
          confidence_level?: string
          contribution?: string | null
          created_at?: string
          gifts?: Json
          guardrail_status?: string
          hypothesis?: string | null
          id?: string
          pastoral_safety_note?: string | null
          people_to_serve?: string | null
          privacy_level?: string
          reviewed_at?: string | null
          schema_version?: string
          statement?: string | null
          status?: string
          updated_at?: string
          user_id: string
          values?: Json
        }
        Update: {
          accepted_at?: string | null
          burdens?: Json
          confidence_level?: string
          contribution?: string | null
          created_at?: string
          gifts?: Json
          guardrail_status?: string
          hypothesis?: string | null
          id?: string
          pastoral_safety_note?: string | null
          people_to_serve?: string | null
          privacy_level?: string
          reviewed_at?: string | null
          schema_version?: string
          statement?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          values?: Json
        }
        Relationships: []
      }
      commitment_documents: {
        Row: {
          consent_version: string | null
          content: string
          created_at: string
          goal_id: string
          id: string
          privacy_check: Json
          reviewed_at: string | null
          schema_version: string
          shared_at: string | null
          shared_with_atalaias: boolean
          sharing_permissions: Json
          status: string
          structured_content: Json
          title: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          consent_version?: string | null
          content: string
          created_at?: string
          goal_id: string
          id?: string
          privacy_check?: Json
          reviewed_at?: string | null
          schema_version?: string
          shared_at?: string | null
          shared_with_atalaias?: boolean
          sharing_permissions?: Json
          status?: string
          structured_content?: Json
          title: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          consent_version?: string | null
          content?: string
          created_at?: string
          goal_id?: string
          id?: string
          privacy_check?: Json
          reviewed_at?: string | null
          schema_version?: string
          shared_at?: string | null
          shared_with_atalaias?: boolean
          sharing_permissions?: Json
          status?: string
          structured_content?: Json
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "commitment_documents_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      commitment_levers: {
        Row: {
          commitment_document_id: string | null
          created_at: string
          description: string
          goal_id: string
          id: string
          lever_subtype: string | null
          lever_type: string
          reviewed_at: string | null
          safety_notes: Json
          safety_status: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commitment_document_id?: string | null
          created_at?: string
          description: string
          goal_id: string
          id?: string
          lever_subtype?: string | null
          lever_type: string
          reviewed_at?: string | null
          safety_notes?: Json
          safety_status?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commitment_document_id?: string | null
          created_at?: string
          description?: string
          goal_id?: string
          id?: string
          lever_subtype?: string | null
          lever_type?: string
          reviewed_at?: string | null
          safety_notes?: Json
          safety_status?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commitment_levers_commitment_document_id_user_id_fkey"
            columns: ["commitment_document_id", "user_id"]
            isOneToOne: false
            referencedRelation: "commitment_documents"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "commitment_levers_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      consent_records: {
        Row: {
          accepted_at: string
          consent_type: string
          created_at: string
          id: string
          metadata: Json
          revoked_at: string | null
          scope: string
          subject_id: string | null
          subject_type: string | null
          user_id: string
          version: string
        }
        Insert: {
          accepted_at?: string
          consent_type: string
          created_at?: string
          id?: string
          metadata?: Json
          revoked_at?: string | null
          scope: string
          subject_id?: string | null
          subject_type?: string | null
          user_id: string
          version: string
        }
        Update: {
          accepted_at?: string
          consent_type?: string
          created_at?: string
          id?: string
          metadata?: Json
          revoked_at?: string | null
          scope?: string
          subject_id?: string | null
          subject_type?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      discipline_scoreboards: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          period: string
          restart_tracking: boolean
          risk_notes: Json
          title: string
          updated_at: string
          user_id: string
          user_review_required: boolean
          visibility: string
          visual_guidance: string | null
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          period?: string
          restart_tracking?: boolean
          risk_notes?: Json
          title: string
          updated_at?: string
          user_id: string
          user_review_required?: boolean
          visibility?: string
          visual_guidance?: string | null
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          period?: string
          restart_tracking?: boolean
          risk_notes?: Json
          title?: string
          updated_at?: string
          user_id?: string
          user_review_required?: boolean
          visibility?: string
          visual_guidance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discipline_scoreboards_goal_user_fk"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      energy_checkins: {
        Row: {
          captured_at: string
          client_created_at: string | null
          client_mutation_id: string | null
          created_at: string
          energy_level: string
          id: string
          note: string | null
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          captured_at?: string
          client_created_at?: string | null
          client_mutation_id?: string | null
          created_at?: string
          energy_level: string
          id?: string
          note?: string | null
          source?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          captured_at?: string
          client_created_at?: string | null
          client_mutation_id?: string | null
          created_at?: string
          energy_level?: string
          id?: string
          note?: string | null
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_distractions: {
        Row: {
          captured_at: string
          content: string
          distraction_type: string
          focus_session_id: string
          id: string
          routed_to_inbox: boolean
          routed_to_inbox_item_id: string | null
          user_id: string
        }
        Insert: {
          captured_at?: string
          content: string
          distraction_type?: string
          focus_session_id: string
          id?: string
          routed_to_inbox?: boolean
          routed_to_inbox_item_id?: string | null
          user_id: string
        }
        Update: {
          captured_at?: string
          content?: string
          distraction_type?: string
          focus_session_id?: string
          id?: string
          routed_to_inbox?: boolean
          routed_to_inbox_item_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_distractions_focus_session_id_user_id_fkey"
            columns: ["focus_session_id", "user_id"]
            isOneToOne: false
            referencedRelation: "focus_sessions"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "focus_distractions_routed_to_inbox_item_id_user_id_fkey"
            columns: ["routed_to_inbox_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "inbox_items"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          action_unblock_session_id: string | null
          calendar_block_id: string | null
          completion_note: string | null
          created_at: string
          duration_minutes: number
          ended_at: string | null
          id: string
          pause_count: number
          post_energy_level: string | null
          started_at: string
          status: string
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_unblock_session_id?: string | null
          calendar_block_id?: string | null
          completion_note?: string | null
          created_at?: string
          duration_minutes: number
          ended_at?: string | null
          id?: string
          pause_count?: number
          post_energy_level?: string | null
          started_at?: string
          status?: string
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_unblock_session_id?: string | null
          calendar_block_id?: string | null
          completion_note?: string | null
          created_at?: string
          duration_minutes?: number
          ended_at?: string | null
          id?: string
          pause_count?: number
          post_energy_level?: string | null
          started_at?: string
          status?: string
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_action_unblock_user_fk"
            columns: ["action_unblock_session_id", "user_id"]
            isOneToOne: false
            referencedRelation: "action_unblock_sessions"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "focus_sessions_calendar_block_user_fk"
            columns: ["calendar_block_id", "user_id"]
            isOneToOne: false
            referencedRelation: "calendar_blocks"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "focus_sessions_task_id_user_id_fkey"
            columns: ["task_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      garden_events: {
        Row: {
          created_at: string
          event_type: string
          garden_state_id: string | null
          id: string
          impact: number
          life_area_id: string | null
          metadata: Json
          metadata_minimal: Json
          source_id: string | null
          source_type: string | null
          user_id: string
          weekly_review_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          garden_state_id?: string | null
          id?: string
          impact?: number
          life_area_id?: string | null
          metadata?: Json
          metadata_minimal?: Json
          source_id?: string | null
          source_type?: string | null
          user_id: string
          weekly_review_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          garden_state_id?: string | null
          id?: string
          impact?: number
          life_area_id?: string | null
          metadata?: Json
          metadata_minimal?: Json
          source_id?: string | null
          source_type?: string | null
          user_id?: string
          weekly_review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garden_events_garden_state_id_user_id_fkey"
            columns: ["garden_state_id", "user_id"]
            isOneToOne: false
            referencedRelation: "garden_states"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "garden_events_life_area_id_user_id_fkey"
            columns: ["life_area_id", "user_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "garden_events_weekly_review_owner_fk"
            columns: ["weekly_review_id", "user_id"]
            isOneToOne: false
            referencedRelation: "weekly_reviews"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      garden_states: {
        Row: {
          area_states: Json
          created_at: string
          derived_at: string | null
          derived_from_weekly_review_id: string | null
          id: string
          privacy_level: string
          schema_version: string
          unlocked_items: Json
          updated_at: string
          user_id: string
          weekly_growth_summary: string | null
        }
        Insert: {
          area_states?: Json
          created_at?: string
          derived_at?: string | null
          derived_from_weekly_review_id?: string | null
          id?: string
          privacy_level?: string
          schema_version?: string
          unlocked_items?: Json
          updated_at?: string
          user_id: string
          weekly_growth_summary?: string | null
        }
        Update: {
          area_states?: Json
          created_at?: string
          derived_at?: string | null
          derived_from_weekly_review_id?: string | null
          id?: string
          privacy_level?: string
          schema_version?: string
          unlocked_items?: Json
          updated_at?: string
          user_id?: string
          weekly_growth_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garden_states_weekly_review_owner_fk"
            columns: ["derived_from_weekly_review_id", "user_id"]
            isOneToOne: false
            referencedRelation: "weekly_reviews"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      goals: {
        Row: {
          achievable: string | null
          calling_id: string | null
          created_at: string
          description: string | null
          ecological_analysis: Json | null
          id: string
          life_area_id: string | null
          measurable: string | null
          next_action: string | null
          progress_percent: number
          relevant: string | null
          specific: string | null
          status: string
          time_bound: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievable?: string | null
          calling_id?: string | null
          created_at?: string
          description?: string | null
          ecological_analysis?: Json | null
          id?: string
          life_area_id?: string | null
          measurable?: string | null
          next_action?: string | null
          progress_percent?: number
          relevant?: string | null
          specific?: string | null
          status?: string
          time_bound?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievable?: string | null
          calling_id?: string | null
          created_at?: string
          description?: string | null
          ecological_analysis?: Json | null
          id?: string
          life_area_id?: string | null
          measurable?: string | null
          next_action?: string | null
          progress_percent?: number
          relevant?: string | null
          specific?: string | null
          status?: string
          time_bound?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_calling_id_user_id_fkey"
            columns: ["calling_id", "user_id"]
            isOneToOne: false
            referencedRelation: "callings"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "goals_life_area_id_user_id_fkey"
            columns: ["life_area_id", "user_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          log_date: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          log_date?: string
          notes?: string | null
          status: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_user_id_fkey"
            columns: ["habit_id", "user_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      habits: {
        Row: {
          adjustments: Json
          created_at: string
          environment_design: string | null
          frequency: Json
          goal_id: string | null
          id: string
          ideal_version: string | null
          identity: string | null
          identity_statement: string | null
          if_then_plan: string | null
          life_area: string | null
          likely_obstacle: string | null
          metric: string | null
          minimum_version: string
          restart_plan: string | null
          reward: string | null
          risk_of_overload: string | null
          schedule_suggestion: string | null
          schema_version: string
          scoreboard_items: Json
          status: string
          title: string
          trigger: string | null
          updated_at: string
          user_id: string
          user_review_required: boolean
          why_it_matters: string | null
        }
        Insert: {
          adjustments?: Json
          created_at?: string
          environment_design?: string | null
          frequency?: Json
          goal_id?: string | null
          id?: string
          ideal_version?: string | null
          identity?: string | null
          identity_statement?: string | null
          if_then_plan?: string | null
          life_area?: string | null
          likely_obstacle?: string | null
          metric?: string | null
          minimum_version: string
          restart_plan?: string | null
          reward?: string | null
          risk_of_overload?: string | null
          schedule_suggestion?: string | null
          schema_version?: string
          scoreboard_items?: Json
          status?: string
          title: string
          trigger?: string | null
          updated_at?: string
          user_id: string
          user_review_required?: boolean
          why_it_matters?: string | null
        }
        Update: {
          adjustments?: Json
          created_at?: string
          environment_design?: string | null
          frequency?: Json
          goal_id?: string | null
          id?: string
          ideal_version?: string | null
          identity?: string | null
          identity_statement?: string | null
          if_then_plan?: string | null
          life_area?: string | null
          likely_obstacle?: string | null
          metric?: string | null
          minimum_version?: string
          restart_plan?: string | null
          reward?: string | null
          risk_of_overload?: string | null
          schedule_suggestion?: string | null
          schema_version?: string
          scoreboard_items?: Json
          status?: string
          title?: string
          trigger?: string | null
          updated_at?: string
          user_id?: string
          user_review_required?: boolean
          why_it_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habits_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      inbox_items: {
        Row: {
          ai_classification: Json
          clarifying_question: string | null
          classification: string | null
          confidence_level: string | null
          content: string
          content_type: string
          created_at: string
          destination_id: string | null
          destination_type: string | null
          due_date_suggestion: string | null
          energy_level: string | null
          estimated_minutes: number | null
          id: string
          life_area: string | null
          processed_at: string | null
          processing_note: string | null
          recommended_action: string | null
          safety_note: string | null
          status: string
          suggested_title: string | null
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_classification?: Json
          clarifying_question?: string | null
          classification?: string | null
          confidence_level?: string | null
          content: string
          content_type?: string
          created_at?: string
          destination_id?: string | null
          destination_type?: string | null
          due_date_suggestion?: string | null
          energy_level?: string | null
          estimated_minutes?: number | null
          id?: string
          life_area?: string | null
          processed_at?: string | null
          processing_note?: string | null
          recommended_action?: string | null
          safety_note?: string | null
          status?: string
          suggested_title?: string | null
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_classification?: Json
          clarifying_question?: string | null
          classification?: string | null
          confidence_level?: string | null
          content?: string
          content_type?: string
          created_at?: string
          destination_id?: string | null
          destination_type?: string | null
          due_date_suggestion?: string | null
          energy_level?: string | null
          estimated_minutes?: number | null
          id?: string
          life_area?: string | null
          processed_at?: string | null
          processing_note?: string | null
          recommended_action?: string | null
          safety_note?: string | null
          status?: string
          suggested_title?: string | null
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      life_areas: {
        Row: {
          color: string | null
          created_at: string
          current_score: number | null
          icon: string | null
          id: string
          name: string
          position: number
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          current_score?: number | null
          icon?: string | null
          id?: string
          name: string
          position?: number
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          current_score?: number | null
          icon?: string | null
          id?: string
          name?: string
          position?: number
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      life_map_area_scores: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          life_area_id: string
          note: string | null
          score: number
          user_id: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          life_area_id: string
          note?: string | null
          score: number
          user_id: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          life_area_id?: string
          note?: string | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_map_area_scores_assessment_id_user_id_fkey"
            columns: ["assessment_id", "user_id"]
            isOneToOne: false
            referencedRelation: "life_map_assessments"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "life_map_area_scores_life_area_id_user_id_fkey"
            columns: ["life_area_id", "user_id"]
            isOneToOne: false
            referencedRelation: "life_areas"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      life_map_assessments: {
        Row: {
          ai_summary: string | null
          answers: Json
          assessment_date: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          answers?: Json
          assessment_date?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          answers?: Json
          assessment_date?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      metacognition_sessions: {
        Row: {
          ai_reframe: string | null
          category: string | null
          christian_anchor: string | null
          cognitive_patterns: Json
          confrontation_question: string | null
          created_at: string
          crisis_flag: boolean
          dominant_automatic_thought: string | null
          emotional_state: string | null
          fact: string | null
          feeling: string | null
          id: string
          impulse: string | null
          intensity: number | null
          intensity_observed: string | null
          interpretation: string | null
          logical_deconstruction: string | null
          next_action: string | null
          privacy_level: string
          privacy_note: string | null
          raw_thought: string | null
          recommended_route: string | null
          related_goal_id: string | null
          related_project_id: string | null
          related_task_id: string | null
          safety_flags: Json
          schema_version: string
          share_with_accountability_allowed: boolean
          updated_at: string
          user_id: string
          user_review_required: boolean
        }
        Insert: {
          ai_reframe?: string | null
          category?: string | null
          christian_anchor?: string | null
          cognitive_patterns?: Json
          confrontation_question?: string | null
          created_at?: string
          crisis_flag?: boolean
          dominant_automatic_thought?: string | null
          emotional_state?: string | null
          fact?: string | null
          feeling?: string | null
          id?: string
          impulse?: string | null
          intensity?: number | null
          intensity_observed?: string | null
          interpretation?: string | null
          logical_deconstruction?: string | null
          next_action?: string | null
          privacy_level?: string
          privacy_note?: string | null
          raw_thought?: string | null
          recommended_route?: string | null
          related_goal_id?: string | null
          related_project_id?: string | null
          related_task_id?: string | null
          safety_flags?: Json
          schema_version?: string
          share_with_accountability_allowed?: boolean
          updated_at?: string
          user_id: string
          user_review_required?: boolean
        }
        Update: {
          ai_reframe?: string | null
          category?: string | null
          christian_anchor?: string | null
          cognitive_patterns?: Json
          confrontation_question?: string | null
          created_at?: string
          crisis_flag?: boolean
          dominant_automatic_thought?: string | null
          emotional_state?: string | null
          fact?: string | null
          feeling?: string | null
          id?: string
          impulse?: string | null
          intensity?: number | null
          intensity_observed?: string | null
          interpretation?: string | null
          logical_deconstruction?: string | null
          next_action?: string | null
          privacy_level?: string
          privacy_note?: string | null
          raw_thought?: string | null
          recommended_route?: string | null
          related_goal_id?: string | null
          related_project_id?: string | null
          related_task_id?: string | null
          safety_flags?: Json
          schema_version?: string
          share_with_accountability_allowed?: boolean
          updated_at?: string
          user_id?: string
          user_review_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "metacognition_sessions_related_goal_id_user_id_fkey"
            columns: ["related_goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "metacognition_sessions_related_project_id_user_id_fkey"
            columns: ["related_project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "metacognition_sessions_related_task_id_user_id_fkey"
            columns: ["related_task_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      microtasks: {
        Row: {
          completed_at: string | null
          created_at: string
          estimated_minutes: number | null
          id: string
          position: number
          status: string
          task_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimated_minutes?: number | null
          id?: string
          position?: number
          status?: string
          task_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimated_minutes?: number | null
          id?: string
          position?: number
          status?: string
          task_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "microtasks_task_id_user_id_fkey"
            columns: ["task_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      product_analytics_events: {
        Row: {
          consent_version: string
          created_at: string
          event_name: string
          expires_at: string
          id: string
          metadata: Json
          occurred_at: string
          schema_version: string
          user_id: string
        }
        Insert: {
          consent_version: string
          created_at?: string
          event_name: string
          expires_at?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          schema_version?: string
          user_id: string
        }
        Update: {
          consent_version?: string
          created_at?: string
          event_name?: string
          expires_at?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          schema_version?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_tone: string
          christian_layer_intensity: string
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          locale: string
          onboarding_status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          ai_tone?: string
          christian_layer_intensity?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          locale?: string
          onboarding_status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          ai_tone?: string
          christian_layer_intensity?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          locale?: string
          onboarding_status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          goal_id: string
          id: string
          next_action: string | null
          phase: string | null
          resources: Json
          risks: Json
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goal_id: string
          id?: string
          next_action?: string | null
          phase?: string | null
          resources?: Json
          risks?: Json
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goal_id?: string
          id?: string
          next_action?: string | null
          phase?: string | null
          resources?: Json
          risks?: Json
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      scoreboard_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          note: string | null
          scoreboard_id: string
          scoreboard_item_id: string | null
          status: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          note?: string | null
          scoreboard_id: string
          scoreboard_item_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          note?: string | null
          scoreboard_id?: string
          scoreboard_item_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "scoreboard_entries_scoreboard_id_user_id_fkey"
            columns: ["scoreboard_id", "user_id"]
            isOneToOne: false
            referencedRelation: "discipline_scoreboards"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scoreboard_entries_scoreboard_item_id_user_id_fkey"
            columns: ["scoreboard_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "scoreboard_items"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      scoreboard_items: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          item_type: string
          linked_goal_id: string | null
          linked_habit_id: string | null
          linked_task_id: string | null
          minimum_success: string | null
          position: number
          scoreboard_id: string
          target_frequency: string | null
          title: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_type: string
          linked_goal_id?: string | null
          linked_habit_id?: string | null
          linked_task_id?: string | null
          minimum_success?: string | null
          position?: number
          scoreboard_id: string
          target_frequency?: string | null
          title: string
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_type?: string
          linked_goal_id?: string | null
          linked_habit_id?: string | null
          linked_task_id?: string | null
          minimum_success?: string | null
          position?: number
          scoreboard_id?: string
          target_frequency?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "scoreboard_items_goal_user_fk"
            columns: ["linked_goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scoreboard_items_habit_user_fk"
            columns: ["linked_habit_id", "user_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scoreboard_items_scoreboard_id_user_id_fkey"
            columns: ["scoreboard_id", "user_id"]
            isOneToOne: false
            referencedRelation: "discipline_scoreboards"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "scoreboard_items_task_user_fk"
            columns: ["linked_task_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          energy_level: string | null
          estimated_minutes: number | null
          goal_id: string | null
          id: string
          next_action: string | null
          priority: string
          project_id: string | null
          reason: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          energy_level?: string | null
          estimated_minutes?: number | null
          goal_id?: string | null
          id?: string
          next_action?: string | null
          priority?: string
          project_id?: string | null
          reason?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string
          task_type?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          energy_level?: string | null
          estimated_minutes?: number | null
          goal_id?: string | null
          id?: string
          next_action?: string | null
          priority?: string
          project_id?: string | null
          reason?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_user_id_fkey"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "tasks_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          ai_provider_preference: string
          analytics_opt_in: boolean
          created_at: string
          focus_default_minutes: number
          id: string
          low_energy_mode: boolean
          next_action_style: string
          notifications: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_provider_preference?: string
          analytics_opt_in?: boolean
          created_at?: string
          focus_default_minutes?: number
          id?: string
          low_energy_mode?: boolean
          next_action_style?: string
          notifications?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_provider_preference?: string
          analytics_opt_in?: boolean
          created_at?: string
          focus_default_minutes?: number
          id?: string
          low_energy_mode?: boolean
          next_action_style?: string
          notifications?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          adjustments: Json
          ai_summary: string | null
          answers: Json
          completed_at: string | null
          created_at: string
          id: string
          next_week_focus: string | null
          overload_warning: boolean
          patterns: Json
          privacy_level: string
          reviewed_at: string | null
          schema_version: string
          status: string
          stuck_points: Json
          updated_at: string
          user_id: string
          user_review_required: boolean
          week_end: string
          week_start: string
          wins: Json
        }
        Insert: {
          adjustments?: Json
          ai_summary?: string | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          next_week_focus?: string | null
          overload_warning?: boolean
          patterns?: Json
          privacy_level?: string
          reviewed_at?: string | null
          schema_version?: string
          status?: string
          stuck_points?: Json
          updated_at?: string
          user_id: string
          user_review_required?: boolean
          week_end: string
          week_start: string
          wins?: Json
        }
        Update: {
          adjustments?: Json
          ai_summary?: string | null
          answers?: Json
          completed_at?: string | null
          created_at?: string
          id?: string
          next_week_focus?: string | null
          overload_warning?: boolean
          patterns?: Json
          privacy_level?: string
          reviewed_at?: string | null
          schema_version?: string
          status?: string
          stuck_points?: Json
          updated_at?: string
          user_id?: string
          user_review_required?: boolean
          week_end?: string
          week_start?: string
          wins?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
